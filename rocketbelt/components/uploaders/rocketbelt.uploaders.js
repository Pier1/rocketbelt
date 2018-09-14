'use strict';
((rb, document, $) => {
  const activeClass = 'uploader-dragged-on';

  // Prevent default drag behaviors
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    document.body.addEventListener(eventName, preventDefaults);
  });

  rb.uploaders = rb.uploaders || {};

  rb.uploaders.addUploader = (uploaderConfig) => {
    if (uploaderConfig &&
        uploaderConfig.selector) {
      const uploader = document.querySelector(uploaderConfig.selector);
      uploader.id = uploader.id || `rb_${rb.getShortId()}`;
      uploaderConfig.id = uploader.id;

      if (!uploader.classList.contains('uploader-expanded')) {
        uploader.setAttribute(rb.aria.role, 'button');
        uploader.setAttribute('tabindex', 0);
      }

      if (!uploader.classList.contains('uploader-mobile')) {
        uploader.addEventListener('click', expandClickHandler);

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
          uploader.addEventListener(eventName, preventDefaults);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
          uploader.addEventListener(eventName, draggedOn);
        });

        ['dragleave', 'drop'].forEach(eventName => {
          uploader.addEventListener(eventName, draggedOff);
        });

        uploader.addEventListener('drop', handleDrop);

        // Add scrim elements
        const scrim = document.createElement('div');
        scrim.classList.add('scrim');
        uploader.insertAdjacentElement('afterbegin', scrim);

        // Register drag-related listeners
        const scrimIcon = document.createElement('div');
        scrimIcon.classList.add('scrim_icon');
        scrim.insertAdjacentElement('afterend', scrimIcon);
      }

      rb.uploaders.config = uploaderConfig;

      // Register listener for keyboard input
      $(uploader).find('.uploader_file-label').keydown((e) => {
        // Since the browser's file input UI is hidden, we need to
        // allow the label it's replaced with to be triggered via
        // keyboard.
        if ((e.which === 13 || e.which === 32)) {
          $(e.target).click();
        }
      });

      $(uploader).find('input[type="file"]').change(fileInputOnchange);
    }
  };

  function expandClickHandler(e) {
    const actualUploader =
      e.target.classList.contains('uploader') ? e.target : e.target.closest('.uploader');
    expandUploader(actualUploader);
  }

  function expandUploader(uploader) {
    uploader.classList.add('uploader-expanded');
    uploader.removeAttribute(rb.aria.role);
    uploader.removeAttribute('tabindex');

    uploader.removeEventListener('click', expandClickHandler);
  }

  function fileInputOnchange(e) {
    rb.uploaders.handleFiles(this.files, rb.uploaders.config);
  }

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function draggedOn(e) {
    const dropArea =
      $(e.target).hasClass(activeClass) ? e.target : $(e.target).closest('.uploader');

    if (!$(dropArea).hasClass(activeClass)) {
      $(dropArea).find('.scrim, .scrim_icon').css('z-index', '1');
      $(dropArea).addClass(activeClass);
    }
  }

  function draggedOff(e) {
    const dropArea =
      $(e.target).hasClass(activeClass) ? e.target : $(e.target).closest('.uploader');

    if ($(dropArea).hasClass(activeClass)) {
      $(dropArea).removeClass(activeClass);
      $(dropArea).find('.scrim, .scrim_icon').css('z-index', '-1');
    }
  }

  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;

    rb.uploaders.handleFiles(files, rb.uploaders.config);
  }

  let uploadProgress = [];
  const progressBar = document.querySelector('.uploader progress');

  function initializeProgress(numFiles) {
    progressBar.value = 0;
    uploadProgress = [];

    for (let i = numFiles; i > 0; i--) {
      uploadProgress.push(0);
    }
  }

  function updateProgress(fileNumber, percent) {
    uploadProgress[fileNumber] = percent;
    const total = uploadProgress.reduce((tot, curr) => tot + curr, 0) / uploadProgress.length;

    progressBar.value = total;
  }

  rb.uploaders.handleFiles = function handleFiles(files) {
    files = [...files];
    initializeProgress(files.length);

    if (rb.uploaders.config.autoUpload) {
      files.forEach(uploadFile);
    }

    files.forEach(previewFile);
  };

  function previewFile(file) {
    rb.uploaders.files = rb.uploaders.files || [];

    const reader = new FileReader();
    reader.size = file.size;
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const img = document.createElement('img');
      img.src = reader.result;
      img.id = `rb_${rb.getShortId()}`;
      img.classList.add('uploader_thumb');

      const f = { id: img.id, file: reader.result, size: reader.size };
      rb.uploaders.files.push(f);

      document.getElementById(rb.uploaders.config.id)
        .dispatchEvent(new CustomEvent('rb.uploaders.fileAdded', { detail: f }));

      const button = document.createElement('button');
      button.dataset.targetId = img.id;
      button.classList.add('uploader_thumbs_remove-button');
      button.innerHTML = '&times;';
      button.setAttribute(rb.aria.label, 'Remove this image');

      rb.once(button, 'click', (e) => {
        const id = e.target.dataset.targetId;
        const imgToRemove = document.querySelector(`#${id}`);
        const container = e.target.closest('.uploader');

        imgToRemove.parentNode.removeChild(imgToRemove);
        e.target.parentNode.removeChild(e.target);

        if (container.querySelectorAll('.uploader_thumb').length === 0) {
          container.classList.remove('uploader-has-thumbs');
        }

        rb.uploaders.files = rb.uploaders.files.filter((el) => {
          return el.id !== id;
        });

        const i = { removedId: id };
        document.getElementById(rb.uploaders.config.id)
          .dispatchEvent(new CustomEvent('rb.uploaders.fileRemoved', { detail: i }));
      });

      document.querySelector('.uploader_thumbs').appendChild(img);
      document.querySelector(`#${img.id}`).insertAdjacentElement('afterend', button);

      document.querySelector(`#${rb.uploaders.config.id}`).classList.add('uploader-has-thumbs');
    };
  }

  function uploadFile(file, i) {
    let formData = new FormData();
    let xhr = new XMLHttpRequest();

    formData = rb.uploaders.config.prepFormData(formData);

    if (rb.uploaders.config.prepXhr) {
      xhr = rb.uploaders.config.prepXhr(xhr);
    }

    xhr.open('POST', rb.uploaders.config.postUri, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    xhr.upload.addEventListener('progress', (e) => {
      updateProgress(i, (e.loaded * 100.0 / e.total) || 100);
    });

    xhr.addEventListener('readystatechange', (e) => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        updateProgress(i, 100);
        // rb.uploaders.onSuccess();
      } else if (xhr.readyState === 4 && xhr.status !== 200) {
        // rb.uploaders.onError(e);
      }
    });

    xhr.send(formData);
  }
})(window.rb, document, jQuery);

