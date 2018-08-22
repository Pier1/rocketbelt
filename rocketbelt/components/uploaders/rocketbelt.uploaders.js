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
        uploaderConfig.selector &&
        uploaderConfig.formData &&
        uploaderConfig.postUri) {
      rb.uploaders.instances = rb.uploaders.instances || [];

      const instanceConfig = {
        selector:  uploaderConfig.selector,
        formData:  uploaderConfig.formData,
        postUri:   uploaderConfig.postUri,
        onError:   uploaderConfig.onError,
        onSuccess: uploaderConfig.onSuccess
      };

      const uploader = document.querySelector(uploaderConfig.selector);
      uploader.id = uploader.id || `rb_${rb.getShortId()}`;
      instanceConfig.id = uploader.id;

      // TODO: Check that the instance isn't already in instances
      rb.uploaders.instances.push(instanceConfig);

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

      // Register listener for keyboard input
      $(uploader).find('.uploader_file-label').keydown((e) => {
        // Since the browser's file input UI is hidden, we need to
        // allow the label it's replaced with to be triggered via
        // keyboard.
        if ((e.which === 13 || e.which === 32)) {
          $(e.target).click();
        }
      });

      $(uploader).find('input[type="file"]').change(function fileInputOnchange(e) {
        const dropArea =
          $(e.target).hasClass(activeClass) ? e.target : $(e.target).closest('.uploader');

        const id = dropArea.id;
        const config = getUploaderConfig(id);

        rb.uploaders.handleFiles(this.files, config);
      });

      // Add scrim elements
      const scrim = document.createElement('div');
      scrim.classList.add('scrim');
      uploader.insertAdjacentElement('afterbegin', scrim);

      // Register drag-related listeners
      const scrimIcon = document.createElement('div');
      scrimIcon.classList.add('scrim_icon');
      scrim.insertAdjacentElement('afterend', scrimIcon);
    }
  };

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

    const dropArea =
      $(e.target).hasClass(activeClass) ? e.target : $(e.target).closest('.uploader');

    const id = dropArea.id;
    const uploaderConfig = getUploaderConfig(id);

    rb.uploaders.handleFiles(this.files, uploaderConfig);
  }

  function getUploaderConfig(id) {
    return rb.uploaders.instances.filter((instance) => {
      return instance.id === id;
    })[0];
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
    files.forEach(uploadFile);
    files.forEach(previewFile);
  };

  function previewFile(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const img = document.createElement('img');
      img.src = reader.result;
      document.querySelector('.uploader_thumbs').appendChild(img);
    };
  }

  function uploadFile(file, i) {
    const url = rb.uploaders.postUri;
    const formData = new FormData(); // rb.uploaders.formData
    // const onError = rb.uploaders.onError

    if (!formData) {
      // rb.uploaders.onError
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    xhr.upload.addEventListener('progress', (e) => {
      updateProgress(i, (e.loaded * 100.0 / e.total) || 100);
    });

    xhr.addEventListener('readystatechange', (e) => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        updateProgress(i, 100);
        // rb.uploaders.onSuccess();
      } else if (xhr.readyState === 4 && xhr.status !== 200) {
        // rb.uploaders.onError();
      }
    });

    formData.append('file', file);

    xhr.send(formData);
  }
})(window.rb, document, jQuery);

