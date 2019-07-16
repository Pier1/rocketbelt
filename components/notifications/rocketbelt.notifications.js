$(function () {
  const defaultConfig = {
    actionText: '',
    additionalClasses: [],
    dismissable: true,
    icon: '',
    iconColor: '',
    position: 'top-right',
    text: 'Description Text Here',
    timeout: 5000
  };
  let config = {};

  function notify(notificationText) {
    let template = $(`
      <div role="alert" aria-live="polite" class="rb-notification ${config.position} ${ !notificationText && config.additionalClasses.length ? config.additionalClasses.join(' ') : '' }">
        <div class="rb-notification-wrap">
          ${ config.icon ? getIconTemplate() : ''}
          <div class="rb-notification-text">
            <div class="description">
              ${notificationText || config.text}
            </div>
            ${ !notificationText && config.actionText ? getActionTemplate() : ''}
          </div>
          <div class="rb-notification-close">
            X
          </div>
        </div>
      </div>
    `);

    $('body').append(template);
    setTimeout(() => {
      $(template).remove();
    }, config.timeout)
  }

  function getActionTemplate() {
    return `
    <div class="action">
      ${config.actionText}
    </div>
    `
  }

  function getIconTemplate() {
    return `
    <div class="rb-notification-icon">
      <svg class="icon" role="img" style="color: ${config.iconColor}">
        <use xlink:href="/components/icons/rocketbelt.icons.svg#rb-icon-${config.icon}"></use>
      </svg>
    </div>
    `
  }

  function overrideDefault(key, value) {
    config[key] = value;
  }

  function reConfig(newConfig = {}) {
    Object.keys(newConfig).forEach(key => {
      overrideDefault(key, newConfig[key])
    });
    notify();
  }

  function resetConfig() {
    Object.keys(defaultConfig).forEach(key => {
      config[key] = defaultConfig[key]
    });
  }

  $.rbNotify = function(params) {
    resetConfig();
    if (typeof params === 'string') notify(params)
    else { reConfig(params) }
  }
});
