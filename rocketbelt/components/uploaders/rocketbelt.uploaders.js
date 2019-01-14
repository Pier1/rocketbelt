'use strict';
((rb, document, $) => {
  const activeClass = 'uploader-dragged-on';
  const maxFilesClass = 'uploader-max-files';

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

      uploaderConfig.isMobile =
        uploaderConfig.isMobile ||
        (uploader && uploader.classList && uploader.classList.contains('uploader-mobile')) ||
        document.querySelectorAll('.mobile .uploader, .tablet .uploader').length > 0;

      if (uploader && uploader.classList) {
        if (uploaderConfig.isMobile) {
          uploader.classList.add('uploader-mobile');
          uploader.addEventListener('click', mobileOpenPhotos);
        }

        if (!uploader.classList.contains('uploader-expanded')) {
          uploader.setAttribute(rb.aria.role, 'button');
          uploader.setAttribute('tabindex', 0);
        }
      }

      if (!uploaderConfig.isMobile) {
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

    return uploader.id;
  };

  function mobileOpenPhotos(e) {
    $(`#${getClosestUploader(e.target).id} input[type="file"]`).click();
  }

  function getClosestUploader(el) {
    let actualUploader;

    if (el.classList) {
      actualUploader =
      el.classList.contains('uploader') ? el : el.closest('.uploader');
    }

    return actualUploader;
  }

  function expandClickHandler(e) {
    expandUploader(getClosestUploader(e.target));
  }



  function expandUploader(uploader) {
    if (uploader && uploader.classList) {
      if (uploader.classList) {
        uploader.classList.add('uploader-expanded');
      }

      uploader.removeAttribute(rb.aria.role);
      uploader.removeAttribute('tabindex');

      uploader.removeEventListener('click', mobileOpenPhotos);
      uploader.removeEventListener('click', expandClickHandler);
    }
  }

  function fileInputOnchange(e) {
    if (rb.uploaders.config.isMobile) {
      expandClickHandler(e);
    }

    rb.uploaders.handleFiles(this.files, rb.uploaders.config);
  }

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function draggedOn(e) {
    const $target = $(e.target);
    
    const $dropArea =
      $target.hasClass(activeClass) ? $target : $target.closest('.uploader');

    if (!$dropArea.hasClass(activeClass)) {
      $dropArea.find('.scrim, .scrim_icon').css('z-index', '1');
      $dropArea.addClass(activeClass);
    }
  }

  function draggedOff(e) {
    const $target = $(e.target);

    const $dropArea =
      $target.hasClass(activeClass) ? $target : $target.closest('.uploader');

    if ($dropArea.hasClass(activeClass)) {
      $dropArea.removeClass(activeClass);
      $dropArea.find('.scrim, .scrim_icon').css('z-index', '-1');
    }
  }

  rb.uploaders.numCanAdd = () => {
    const numFiles = rb.uploaders.files ? rb.uploaders.files.length : 0;
    const maxFiles = rb.uploaders.config.maxFiles || Number.POSITIVE_INFINITY;

    return maxFiles - numFiles;
  };

  function handleDrop(e) {
    if (rb.uploaders.numCanAdd() > 0) {
      const dt = e.dataTransfer;
      const files = dt.files;

      rb.uploaders.handleFiles(files, rb.uploaders.config);
    }
  }

  rb.uploaders.handleFiles = function handleFiles(files) {
    const numCanAdd = rb.uploaders.numCanAdd();

    const filesToAdd = [...files].slice(0, numCanAdd);

    filesToAdd.forEach(previewFile);
  };

  function previewFile(file) {
    rb.uploaders.files = rb.uploaders.files || [];

    const reader = new FileReader();
    reader.size = file.size;

    document.getElementById(rb.uploaders.config.id)
      .dispatchEvent(new CustomEvent('rb.uploaders.addingFile'));

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

        if (container && container.querySelectorAll('.uploader_thumb').length === 0) {
          container.classList.remove('uploader-has-thumbs');
        }

        rb.uploaders.files = rb.uploaders.files.filter((el) => {
          return el.id !== id;
        });

        if (rb.uploaders.numCanAdd() > 0) {
          const $dropArea = $(`#${rb.uploaders.config.id}`);

          $('.uploader #uploader_file-input, .uploader .uploader_file-label')
            .removeAttr('disabled');

          $dropArea.removeClass(maxFilesClass);
        }

        const i = { removedId: id };
        document.getElementById(rb.uploaders.config.id)
          .dispatchEvent(new CustomEvent('rb.uploaders.fileRemoved', { detail: i }));
      });

      document.querySelector('.uploader_thumbs').appendChild(img);
      document.querySelector(`#${img.id}`).insertAdjacentElement('afterend', button);

      const u = document.querySelector(`#${rb.uploaders.config.id}`);

      if (u) {
        u.classList.add('uploader-has-thumbs');
      }

      if (!rb.uploaders.numCanAdd()) {
        const $dropArea = $(`#${rb.uploaders.config.id}`);

        $('.uploader #uploader_file-input, .uploader .uploader_file-label').attr('disabled', '');

        $dropArea.addClass(maxFilesClass);
      }
    };
  }
})(window.rb, document, jQuery);

