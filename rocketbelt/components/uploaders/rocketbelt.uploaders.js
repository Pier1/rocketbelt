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
    let uploader;

    if (uploaderConfig &&
        uploaderConfig.selector) {
      uploader = document.querySelector(uploaderConfig.selector);
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

      rb.uploaders.instances = rb.uploaders.instances || [];
      rb.uploaders.instances.push({
        config: uploaderConfig,
        files: []
      });

      // Register listener for keyboard input
      $(uploader).find('.uploader_file-label').keydown((e) => {
        // Since the browser's file input UI is hidden, we need to
        // allow the label it's replaced with to be triggered via
        // keyboard.
        if ((e.which === 13 || e.which === 32)) {
          $(e.target).click();
        }
      });

      const $input = $(uploader).find('input[type="file"]');
      const inputId = $input[0].id || `rb_${rb.getShortId()}`;

      $input.attr('id', inputId);
      $(uploader).find('.uploader_file-label')
        .attr('for', inputId)
        .attr('aria-role', 'button')
        .attr('tabindex', 0);

      $input.change(fileInputOnchange);
    }

    return uploader.id;
  };

  function getClosestUploader(el) {
    let actualUploader;

    if (el.classList) {
      actualUploader =
      el.classList.contains('uploader') ? el : el.closest('.uploader');
    }

    return actualUploader;
  }

  function mobileOpenPhotos(e) {
    if(getClosestUploader(e.target)) {
      $(`#${getClosestUploader(e.target).id} input[type="file"]`).click();
    }
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

  function getInstanceForId(id) {
    return rb.uploaders.instances.filter((i) => {
      return i.config.id === id;
    })[0];
  }

  rb.uploaders.getInstanceForId = getInstanceForId;

  function fileInputOnchange(e) {
    const id = getClosestUploader(e.target).id;
    const instance = getInstanceForId(id);
    const config = instance.config;

    if (config.isMobile) {
      expandClickHandler(e);
    }

    rb.uploaders.handleFiles(this.files, config.id);
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

  rb.uploaders.numCanAdd = (id) => {
    const uploaderInstance = getInstanceForId(id);
    const numFiles = uploaderInstance.files ? uploaderInstance.files.length : 0;
    const maxFiles = uploaderInstance.config.maxFiles || Number.POSITIVE_INFINITY;

    return maxFiles - numFiles;
  };

  function handleDrop(e) {
    const uploader = getClosestUploader(e.target);

    if (rb.uploaders.numCanAdd(uploader.id) > 0) {
      const dt = e.dataTransfer;
      const files = dt.files;

      rb.uploaders.handleFiles(files, uploader.id);
    }
  }

  rb.uploaders.handleFiles = function handleFiles(files, uploaderId) {
    const numCanAdd = rb.uploaders.numCanAdd(uploaderId);

    const filesToAdd = [...files].slice(0, numCanAdd);
    filesToAdd.forEach(file => { previewFile(file, uploaderId); });
  };

  function previewFile(file, uploaderId) {
    const instance = getInstanceForId(uploaderId);
    const instanceEl = document.getElementById(uploaderId);
    const reader = new FileReader();
    reader.size = file.size;

    instanceEl
      .dispatchEvent(new CustomEvent('rb.uploaders.addingFile'));

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      const fileContents =
        instance.config.filesAsBinary ?
          rb.dataURItoBlob(reader.result) :
          reader.result
      ;

      const img = document.createElement('img');
      img.src = reader.result;
      img.id = `rb_${rb.getShortId()}`;
      img.classList.add('uploader_thumb');

      const f = { id: img.id, file: fileContents, size: reader.size };
      instance.files.push(f);

      instanceEl
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
        const uploader = document.querySelector(instance.config.selector);

        imgToRemove.parentNode.removeChild(imgToRemove);
        e.target.parentNode.removeChild(e.target);
        $(uploader).find('input[type="file"]').val('');

        if (container && container.querySelectorAll('.uploader_thumb').length === 0) {
          container.classList.remove('uploader-has-thumbs');

          if (instance.config.isMobile) {
            container.classList.remove('uploader-expanded');
            uploader.addEventListener('click', mobileOpenPhotos);
          }
        }

        instance.files = instance.files.filter((el) => {
          return el.id !== id;
        });

        if (rb.uploaders.numCanAdd(instanceEl.id) > 0) {
          const $dropArea = $(`#${instanceEl.id}`);

          $(`#${instanceEl.id} .uploader_file-input, #${instanceEl.id} .uploader_file-label`)
            .removeAttr('disabled');

          $dropArea.removeClass(maxFilesClass);
        }

        const i = { removedId: id };
        document.getElementById(instanceEl.id)
          .dispatchEvent(new CustomEvent('rb.uploaders.fileRemoved', { detail: i }));
      });

      document.querySelector(`#${instanceEl.id} .uploader_thumbs`).appendChild(img);
      document.querySelector(`#${img.id}`).insertAdjacentElement('afterend', button);

      const u = document.querySelector(`#${instanceEl.id}`);

      if (u) {
        u.classList.add('uploader-has-thumbs');
      }


      if (!rb.uploaders.numCanAdd(instanceEl.id)) {
        const $dropArea = $(`#${instanceEl.id}`);

        $(`#${instanceEl.id} .uploader_file-input, #${instanceEl.id} .uploader_file-label`)
          .attr('disabled', '');

        $dropArea.addClass(maxFilesClass);
      }
    };
  }
})(window.rb, document, jQuery);

