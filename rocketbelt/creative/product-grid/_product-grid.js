var gridcontentinjector = (function () {
  var settings;
  var getSettings = function () {
    return {
      supported: CSS.supports('display', 'grid'),
      container: '#cog-container',
      middleDivisible: 30, // shows a new middle every # of products
      content: function () {
        return $(this.container).find('.cog-tile');
      },
      sizes: {
        tall: [1, 2], // width x height
        block: [1, 1],
        wide: [2, 1]
      },
      grid: {
        target: $('.product-grid'),
        colNo: function () {
          var tiles = this.target.children('li');
          var xPos = $(tiles[0]).position().top;
          for (var i = 0; i < tiles.length; i++) {
            if ($(tiles[i]).position().top !== xPos) {
              return i;
            }
          }
          return xPos;
        },
        contentSpaces: 0, // generated - number of spaces taken up by our custom content
        padding: 0, // generated - number of tiles we need to add to the first row to keep consistent styling
        middles: 0, // generated - number of middle cogs added (used for identification)
        loaded: $('#l-cat-header').data('initial-count'), // current number of loaded products
        total: $('#l-cat-header').data('total-count') // total number of products on the page
      }
    };
  };


  function buildContent(content) {
    var contentArr = [];
    var colNo = settings.grid.colNo();

    function calcLastRow() {
      return Math.ceil((settings.grid.total + settings.grid.contentSpaces) / colNo);
    }

    function calcPosition(x, y) {
      return (parseInt(x - 1) * colNo) + parseInt(y - 1);
    }

    function generateHtml(c) {
      var row, col, classes;
      if (!settings.supported) {
        classes = 'grid-tile cog-tile cog-tile-fallback cog-tile-' + c.type;
        if (c.tag.length) {
          for (var i = 0; i < c.tag.length; i++) {
            classes += ' cog-tile-' + c.tag[i];
          }
        }
        return '<li class="' + classes + '"  data-cog-position="' + c.position + '">' + c.html + '</li>';
      } else {
        classes = 'grid-tile cog-tile cog-tile-' + c.type;
        if (c.tag.length) {
          for (var j = 0; j < c.tag.length; j++) {
            classes += ' cog-tile-' + c.tag[j];
          }
        }
        switch (c.type) {
        case 'tall':
          row = c.row + '/' + (parseInt(c.row) + settings.sizes[c.type][1]);
          col = c.col;
          break;
        case 'wide':
          row = c.row;
          col = c.col + '/' + (parseInt(c.col) + settings.sizes[c.type][0]);
          break;
        default:
          row = c.row;
          col = c.col;
        }
        return '<li class="' + classes + '" style="grid-row:' + row + ';grid-column:' + col + ';">' + c.html + '</li>';
      }
    }

    function validateConfiguration(c) {
      var width = settings.sizes[c.type][0];
      var height = settings.sizes[c.type][1];

      if (c.tag.indexOf('last') >= 0) {
        if (c.type === 'tall') {
          c.row = calcLastRow() - 1;
        } else {
          c.row = calcLastRow();
        }
      }

      if (c.col >= colNo) {
        if (c.type === 'wide') {
          c.col = colNo - 1;
        } else {
          c.col = colNo;
        }
      }

      if (c.row == 1) {
        settings.grid.padding += width;
      }

      if (c.row >= (settings.grid.loaded / colNo)) {
        c.tag.push('product-show-' +  Math.ceil((c.row * colNo) / settings.middleDivisible) * settings.middleDivisible);
      }

      settings.grid.contentSpaces += (width * height);
      c.position = calcPosition(c.row, c.col);
      return c;
    }

    content.each(function (idx) {
      var c = $(this);
      var cData = c.data();
      contentArr[idx] = {
        type: cData.cogType || 'block',
        row: cData.cogLocation.split(',')[0] || '',
        col: cData.cogLocation.split(',')[1] || '',
        html: c.html()
      };
    });

    contentArr = contentArr.map(function (c) {
      c.tag = [];
      if (c.row === 'last') {
        c.tag.push('last');
        c.row = calcLastRow();
      }
      if (c.row === 'middle') {
        settings.grid.middles = settings.grid.middles + 1;
        c.tag.push('middle-' + settings.grid.middles);
        c.row = Math.ceil(((settings.middleDivisible / colNo) * settings.grid.middles) / 2);
      }
      c.col = c.col === 'last' ? colNo : c.col;
      c.col = c.col === 'middle' ? Math.ceil(colNo / 2) : c.col;
      c.position = calcPosition(c.row, c.col);
      return c;
    }).sort(function (a, b) {
      return a.position - b.position;
    }).map(validateConfiguration).map(generateHtml);

    return contentArr;
  }

  function addProductsLoadedClass(amt) {
    if (amt) {
      if (amt > settings.grid.total) {
        amt = settings.grid.total;
      }
      settings.grid.loaded = amt;
      amt = amt + 1;
      var amtClass = '';

      if (amt >= settings.grid.total) {
        amtClass += 'product-grid-loaded-full ';
      }

      var initialAmt = amt / settings.middleDivisible;
      if (initialAmt > 1) {
        var initialClasses = '';
        for (var i = 1; i < initialAmt; i++) {
          var tempAmt = i * settings.middleDivisible;
          initialClasses += ' product-grid-loaded-' + tempAmt;
        }
        amtClass += initialClasses;
      }
      $(settings.grid.target).addClass(amtClass);
    }
  }

  function injectFallbackContent(loaded) {
    var i = settings.built.length;
    while (i--) {
      var pos = $(settings.built[i]).attr('data-cog-position');
      if (pos <= (loaded + settings.grid.contentSpaces)) {
        var tiles = settings.grid.target.children('li');
        if (pos > tiles.length) {
          $(tiles[tiles.length - 1]).after(settings.built[i]);
        } else {
          tiles.eq(pos).before(settings.built[i]);
        }
        settings.built.splice(i, 1);
      }
    }
  }

  function init(user) {
    settings = getSettings();
    if (user) {
      for (var prop in user) {
        if (settings.hasOwnProperty(prop)) {
          settings[prop] = user[prop];
        }
      }
    }

    if (settings.grid.target.length && $(settings.container).length && settings.content().length) {
      var content = settings.content();
      settings.built = buildContent(content);


      if (!settings.supported) settings.built.reverse();

      addProductsLoadedClass(settings.grid.loaded);
      $('body')[0].addEventListener('grid.loaded', function (e) {
        var amt = e.detail.loaded;
        addProductsLoadedClass(amt);
        if (!settings.supported) injectFallbackContent(amt);
      });

      if (!settings.supported) {
        injectFallbackContent(settings.grid.loaded);
      } else {
        var padding = '';
        for (var i = 0; i < settings.grid.padding; i++) {
          padding += '<li class="cog-padding" style="display:none"></li>';
        }
        settings.grid.target.prepend(padding);
        settings.grid.target.append(settings.built);
      }
    }
  }

  return {
    init: init
  };
})();
