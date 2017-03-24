/*! Flexibility 1.0.6 | MIT Licensed | github.com/10up/flexibility */
(function () {
  window.flexibility = {};

  if (!Array.prototype.forEach) {
    Array.prototype.forEach = function forEach(callback) {
      if (this === undefined || this === null) {
        throw new TypeError(this + 'is not an object');
      }

      if (!(callback instanceof Function)) {
        throw new TypeError(callback + ' is not a function');
      }

      var object = Object(this);
      var scope = arguments[1];
      var arraylike = object instanceof String ? object.split('') : object;
      var length = Math.max(Math.min(arraylike.length, 9007199254740991), 0) || 0;
      var index = -1;

      while (++index < length) {
        if (index in arraylike) {
          callback.call(scope, arraylike[index], index, object);
        }
      }
    };
  }

  // UMD (Universal Module Definition)
  // See https://github.com/umdjs/umd for reference
  //
  // This file uses the following specific UMD implementation:
  // https://github.com/umdjs/umd/blob/master/returnExports.js
  (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module.
      define([], factory);
    } else if (typeof exports === 'object') {
      // Node. Does not work with strict CommonJS, but
      // only CommonJS-like environments that support module.exports,
      // like Node.
      module.exports = factory();
    } else {
      // Browser globals (root is window)
      root.computeLayout = factory();
    }
  }(flexibility, function() {
    /**
   * Copyright (c) 2014, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   */

  var computeLayout = (function() {

    var CSS_UNDEFINED;

    var CSS_DIRECTION_INHERIT = 'inherit';
    var CSS_DIRECTION_LTR = 'ltr';
    var CSS_DIRECTION_RTL = 'rtl';

    var CSS_FLEX_DIRECTION_ROW = 'row';
    var CSS_FLEX_DIRECTION_ROW_REVERSE = 'row-reverse';
    var CSS_FLEX_DIRECTION_COLUMN = 'column';
    var CSS_FLEX_DIRECTION_COLUMN_REVERSE = 'column-reverse';

    var CSS_JUSTIFY_FLEX_START = 'flex-start';
    var CSS_JUSTIFY_CENTER = 'center';
    var CSS_JUSTIFY_FLEX_END = 'flex-end';
    var CSS_JUSTIFY_SPACE_BETWEEN = 'space-between';
    var CSS_JUSTIFY_SPACE_AROUND = 'space-around';

    var CSS_ALIGN_FLEX_START = 'flex-start';
    var CSS_ALIGN_CENTER = 'center';
    var CSS_ALIGN_FLEX_END = 'flex-end';
    var CSS_ALIGN_STRETCH = 'stretch';

    var CSS_POSITION_RELATIVE = 'relative';
    var CSS_POSITION_ABSOLUTE = 'absolute';

    var leading = {
      'row': 'left',
      'row-reverse': 'right',
      'column': 'top',
      'column-reverse': 'bottom'
    };
    var trailing = {
      'row': 'right',
      'row-reverse': 'left',
      'column': 'bottom',
      'column-reverse': 'top'
    };
    var pos = {
      'row': 'left',
      'row-reverse': 'right',
      'column': 'top',
      'column-reverse': 'bottom'
    };
    var dim = {
      'row': 'width',
      'row-reverse': 'width',
      'column': 'height',
      'column-reverse': 'height'
    };

    // When transpiled to Java / C the node type has layout, children and style
    // properties. For the JavaScript version this function adds these properties
    // if they don't already exist.
    function fillNodes(node) {
      if (!node.layout || node.isDirty) {
        node.layout = {
          width: undefined,
          height: undefined,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        };
      }

      if (!node.style) {
        node.style = {};
      }

      if (!node.children) {
        node.children = [];
      }

      if (node.style.measure && node.children && node.children.length) {
        throw new Error('Using custom measure function is supported only for leaf nodes.');
      }

      node.children.forEach(fillNodes);
      return node;
    }

    function isUndefined(value) {
      return value === undefined;
    }

    function isRowDirection(flexDirection) {
      return flexDirection === CSS_FLEX_DIRECTION_ROW ||
             flexDirection === CSS_FLEX_DIRECTION_ROW_REVERSE;
    }

    function isColumnDirection(flexDirection) {
      return flexDirection === CSS_FLEX_DIRECTION_COLUMN ||
             flexDirection === CSS_FLEX_DIRECTION_COLUMN_REVERSE;
    }

    function getLeadingMargin(node, axis) {
      if (node.style.marginStart !== undefined && isRowDirection(axis)) {
        return node.style.marginStart;
      }

      var value = null;
      switch (axis) {
        case 'row':            value = node.style.marginLeft;   break;
        case 'row-reverse':    value = node.style.marginRight;  break;
        case 'column':         value = node.style.marginTop;    break;
        case 'column-reverse': value = node.style.marginBottom; break;
      }

      if (value !== undefined) {
        return value;
      }

      if (node.style.margin !== undefined) {
        return node.style.margin;
      }

      return 0;
    }

    function getTrailingMargin(node, axis) {
      if (node.style.marginEnd !== undefined && isRowDirection(axis)) {
        return node.style.marginEnd;
      }

      var value = null;
      switch (axis) {
        case 'row':            value = node.style.marginRight;  break;
        case 'row-reverse':    value = node.style.marginLeft;   break;
        case 'column':         value = node.style.marginBottom; break;
        case 'column-reverse': value = node.style.marginTop;    break;
      }

      if (value != null) {
        return value;
      }

      if (node.style.margin !== undefined) {
        return node.style.margin;
      }

      return 0;
    }

    function getLeadingPadding(node, axis) {
      if (node.style.paddingStart !== undefined && node.style.paddingStart >= 0
          && isRowDirection(axis)) {
        return node.style.paddingStart;
      }

      var value = null;
      switch (axis) {
        case 'row':            value = node.style.paddingLeft;   break;
        case 'row-reverse':    value = node.style.paddingRight;  break;
        case 'column':         value = node.style.paddingTop;    break;
        case 'column-reverse': value = node.style.paddingBottom; break;
      }

      if (value != null && value >= 0) {
        return value;
      }

      if (node.style.padding !== undefined && node.style.padding >= 0) {
        return node.style.padding;
      }

      return 0;
    }

    function getTrailingPadding(node, axis) {
      if (node.style.paddingEnd !== undefined && node.style.paddingEnd >= 0
          && isRowDirection(axis)) {
        return node.style.paddingEnd;
      }

      var value = null;
      switch (axis) {
        case 'row':            value = node.style.paddingRight;  break;
        case 'row-reverse':    value = node.style.paddingLeft;   break;
        case 'column':         value = node.style.paddingBottom; break;
        case 'column-reverse': value = node.style.paddingTop;    break;
      }

      if (value != null && value >= 0) {
        return value;
      }

      if (node.style.padding !== undefined && node.style.padding >= 0) {
        return node.style.padding;
      }

      return 0;
    }

    function getLeadingBorder(node, axis) {
      if (node.style.borderStartWidth !== undefined && node.style.borderStartWidth >= 0
          && isRowDirection(axis)) {
        return node.style.borderStartWidth;
      }

      var value = null;
      switch (axis) {
        case 'row':            value = node.style.borderLeftWidth;   break;
        case 'row-reverse':    value = node.style.borderRightWidth;  break;
        case 'column':         value = node.style.borderTopWidth;    break;
        case 'column-reverse': value = node.style.borderBottomWidth; break;
      }

      if (value != null && value >= 0) {
        return value;
      }

      if (node.style.borderWidth !== undefined && node.style.borderWidth >= 0) {
        return node.style.borderWidth;
      }

      return 0;
    }

    function getTrailingBorder(node, axis) {
      if (node.style.borderEndWidth !== undefined && node.style.borderEndWidth >= 0
          && isRowDirection(axis)) {
        return node.style.borderEndWidth;
      }

      var value = null;
      switch (axis) {
        case 'row':            value = node.style.borderRightWidth;  break;
        case 'row-reverse':    value = node.style.borderLeftWidth;   break;
        case 'column':         value = node.style.borderBottomWidth; break;
        case 'column-reverse': value = node.style.borderTopWidth;    break;
      }

      if (value != null && value >= 0) {
        return value;
      }

      if (node.style.borderWidth !== undefined && node.style.borderWidth >= 0) {
        return node.style.borderWidth;
      }

      return 0;
    }

    function getLeadingPaddingAndBorder(node, axis) {
      return getLeadingPadding(node, axis) + getLeadingBorder(node, axis);
    }

    function getTrailingPaddingAndBorder(node, axis) {
      return getTrailingPadding(node, axis) + getTrailingBorder(node, axis);
    }

    function getBorderAxis(node, axis) {
      return getLeadingBorder(node, axis) + getTrailingBorder(node, axis);
    }

    function getMarginAxis(node, axis) {
      return getLeadingMargin(node, axis) + getTrailingMargin(node, axis);
    }

    function getPaddingAndBorderAxis(node, axis) {
      return getLeadingPaddingAndBorder(node, axis) +
          getTrailingPaddingAndBorder(node, axis);
    }

    function getJustifyContent(node) {
      if (node.style.justifyContent) {
        return node.style.justifyContent;
      }
      return 'flex-start';
    }

    function getAlignContent(node) {
      if (node.style.alignContent) {
        return node.style.alignContent;
      }
      return 'flex-start';
    }

    function getAlignItem(node, child) {
      if (child.style.alignSelf) {
        return child.style.alignSelf;
      }
      if (node.style.alignItems) {
        return node.style.alignItems;
      }
      return 'stretch';
    }

    function resolveAxis(axis, direction) {
      if (direction === CSS_DIRECTION_RTL) {
        if (axis === CSS_FLEX_DIRECTION_ROW) {
          return CSS_FLEX_DIRECTION_ROW_REVERSE;
        } else if (axis === CSS_FLEX_DIRECTION_ROW_REVERSE) {
          return CSS_FLEX_DIRECTION_ROW;
        }
      }

      return axis;
    }

    function resolveDirection(node, parentDirection) {
      var direction;
      if (node.style.direction) {
        direction = node.style.direction;
      } else {
        direction = CSS_DIRECTION_INHERIT;
      }

      if (direction === CSS_DIRECTION_INHERIT) {
        direction = (parentDirection === undefined ? CSS_DIRECTION_LTR : parentDirection);
      }

      return direction;
    }

    function getFlexDirection(node) {
      if (node.style.flexDirection) {
        return node.style.flexDirection;
      }
      return CSS_FLEX_DIRECTION_COLUMN;
    }

    function getCrossFlexDirection(flexDirection, direction) {
      if (isColumnDirection(flexDirection)) {
        return resolveAxis(CSS_FLEX_DIRECTION_ROW, direction);
      } else {
        return CSS_FLEX_DIRECTION_COLUMN;
      }
    }

    function getPositionType(node) {
      if (node.style.position) {
        return node.style.position;
      }
      return 'relative';
    }

    function isFlex(node) {
      return (
        getPositionType(node) === CSS_POSITION_RELATIVE &&
        node.style.flex > 0
      );
    }

    function isFlexWrap(node) {
      return node.style.flexWrap === 'wrap';
    }

    function getDimWithMargin(node, axis) {
      return node.layout[dim[axis]] + getMarginAxis(node, axis);
    }

    function isDimDefined(node, axis) {
      return node.style[dim[axis]] !== undefined && node.style[dim[axis]] >= 0;
    }

    function isPosDefined(node, pos) {
      return node.style[pos] !== undefined;
    }

    function isMeasureDefined(node) {
      return node.style.measure !== undefined;
    }

    function getPosition(node, pos) {
      if (node.style[pos] !== undefined) {
        return node.style[pos];
      }
      return 0;
    }

    function boundAxis(node, axis, value) {
      var min = {
        'row': node.style.minWidth,
        'row-reverse': node.style.minWidth,
        'column': node.style.minHeight,
        'column-reverse': node.style.minHeight
      }[axis];

      var max = {
        'row': node.style.maxWidth,
        'row-reverse': node.style.maxWidth,
        'column': node.style.maxHeight,
        'column-reverse': node.style.maxHeight
      }[axis];

      var boundValue = value;
      if (max !== undefined && max >= 0 && boundValue > max) {
        boundValue = max;
      }
      if (min !== undefined && min >= 0 && boundValue < min) {
        boundValue = min;
      }
      return boundValue;
    }

    function fmaxf(a, b) {
      if (a > b) {
        return a;
      }
      return b;
    }

    // When the user specifically sets a value for width or height
    function setDimensionFromStyle(node, axis) {
      // The parent already computed us a width or height. We just skip it
      if (node.layout[dim[axis]] !== undefined) {
        return;
      }
      // We only run if there's a width or height defined
      if (!isDimDefined(node, axis)) {
        return;
      }

      // The dimensions can never be smaller than the padding and border
      node.layout[dim[axis]] = fmaxf(
        boundAxis(node, axis, node.style[dim[axis]]),
        getPaddingAndBorderAxis(node, axis)
      );
    }

    function setTrailingPosition(node, child, axis) {
      child.layout[trailing[axis]] = node.layout[dim[axis]] -
          child.layout[dim[axis]] - child.layout[pos[axis]];
    }

    // If both left and right are defined, then use left. Otherwise return
    // +left or -right depending on which is defined.
    function getRelativePosition(node, axis) {
      if (node.style[leading[axis]] !== undefined) {
        return getPosition(node, leading[axis]);
      }
      return -getPosition(node, trailing[axis]);
    }

    function layoutNodeImpl(node, parentMaxWidth, parentMaxHeight, /*css_direction_t*/parentDirection) {
      var/*css_direction_t*/ direction = resolveDirection(node, parentDirection);
      var/*(c)!css_flex_direction_t*//*(java)!int*/ mainAxis = resolveAxis(getFlexDirection(node), direction);
      var/*(c)!css_flex_direction_t*//*(java)!int*/ crossAxis = getCrossFlexDirection(mainAxis, direction);
      var/*(c)!css_flex_direction_t*//*(java)!int*/ resolvedRowAxis = resolveAxis(CSS_FLEX_DIRECTION_ROW, direction);

      // Handle width and height style attributes
      setDimensionFromStyle(node, mainAxis);
      setDimensionFromStyle(node, crossAxis);

      // Set the resolved resolution in the node's layout
      node.layout.direction = direction;

      // The position is set by the parent, but we need to complete it with a
      // delta composed of the margin and left/top/right/bottom
      node.layout[leading[mainAxis]] += getLeadingMargin(node, mainAxis) +
        getRelativePosition(node, mainAxis);
      node.layout[trailing[mainAxis]] += getTrailingMargin(node, mainAxis) +
        getRelativePosition(node, mainAxis);
      node.layout[leading[crossAxis]] += getLeadingMargin(node, crossAxis) +
        getRelativePosition(node, crossAxis);
      node.layout[trailing[crossAxis]] += getTrailingMargin(node, crossAxis) +
        getRelativePosition(node, crossAxis);

      // Inline immutable values from the target node to avoid excessive method
      // invocations during the layout calculation.
      var/*int*/ childCount = node.children.length;
      var/*float*/ paddingAndBorderAxisResolvedRow = getPaddingAndBorderAxis(node, resolvedRowAxis);
      var/*float*/ paddingAndBorderAxisColumn = getPaddingAndBorderAxis(node, CSS_FLEX_DIRECTION_COLUMN);

      if (isMeasureDefined(node)) {
        var/*bool*/ isResolvedRowDimDefined = !isUndefined(node.layout[dim[resolvedRowAxis]]);

        var/*float*/ width = CSS_UNDEFINED;
        if (isDimDefined(node, resolvedRowAxis)) {
          width = node.style.width;
        } else if (isResolvedRowDimDefined) {
          width = node.layout[dim[resolvedRowAxis]];
        } else {
          width = parentMaxWidth -
            getMarginAxis(node, resolvedRowAxis);
        }
        width -= paddingAndBorderAxisResolvedRow;

        var/*float*/ height = CSS_UNDEFINED;
        if (isDimDefined(node, CSS_FLEX_DIRECTION_COLUMN)) {
          height = node.style.height;
        } else if (!isUndefined(node.layout[dim[CSS_FLEX_DIRECTION_COLUMN]])) {
          height = node.layout[dim[CSS_FLEX_DIRECTION_COLUMN]];
        } else {
          height = parentMaxHeight -
            getMarginAxis(node, resolvedRowAxis);
        }
        height -= getPaddingAndBorderAxis(node, CSS_FLEX_DIRECTION_COLUMN);

        // We only need to give a dimension for the text if we haven't got any
        // for it computed yet. It can either be from the style attribute or because
        // the element is flexible.
        var/*bool*/ isRowUndefined = !isDimDefined(node, resolvedRowAxis) && !isResolvedRowDimDefined;
        var/*bool*/ isColumnUndefined = !isDimDefined(node, CSS_FLEX_DIRECTION_COLUMN) &&
          isUndefined(node.layout[dim[CSS_FLEX_DIRECTION_COLUMN]]);

        // Let's not measure the text if we already know both dimensions
        if (isRowUndefined || isColumnUndefined) {
          var/*css_dim_t*/ measureDim = node.style.measure(
            /*(c)!node->context,*/
            /*(java)!layoutContext.measureOutput,*/
            width,
            height
          );
          if (isRowUndefined) {
            node.layout.width = measureDim.width +
              paddingAndBorderAxisResolvedRow;
          }
          if (isColumnUndefined) {
            node.layout.height = measureDim.height +
              paddingAndBorderAxisColumn;
          }
        }
        if (childCount === 0) {
          return;
        }
      }

      var/*bool*/ isNodeFlexWrap = isFlexWrap(node);

      var/*css_justify_t*/ justifyContent = getJustifyContent(node);

      var/*float*/ leadingPaddingAndBorderMain = getLeadingPaddingAndBorder(node, mainAxis);
      var/*float*/ leadingPaddingAndBorderCross = getLeadingPaddingAndBorder(node, crossAxis);
      var/*float*/ paddingAndBorderAxisMain = getPaddingAndBorderAxis(node, mainAxis);
      var/*float*/ paddingAndBorderAxisCross = getPaddingAndBorderAxis(node, crossAxis);

      var/*bool*/ isMainDimDefined = !isUndefined(node.layout[dim[mainAxis]]);
      var/*bool*/ isCrossDimDefined = !isUndefined(node.layout[dim[crossAxis]]);
      var/*bool*/ isMainRowDirection = isRowDirection(mainAxis);

      var/*int*/ i;
      var/*int*/ ii;
      var/*css_node_t**/ child;
      var/*(c)!css_flex_direction_t*//*(java)!int*/ axis;

      var/*css_node_t**/ firstAbsoluteChild = null;
      var/*css_node_t**/ currentAbsoluteChild = null;

      var/*float*/ definedMainDim = CSS_UNDEFINED;
      if (isMainDimDefined) {
        definedMainDim = node.layout[dim[mainAxis]] - paddingAndBorderAxisMain;
      }

      // We want to execute the next two loops one per line with flex-wrap
      var/*int*/ startLine = 0;
      var/*int*/ endLine = 0;
      // var/*int*/ nextOffset = 0;
      var/*int*/ alreadyComputedNextLayout = 0;
      // We aggregate the total dimensions of the container in those two variables
      var/*float*/ linesCrossDim = 0;
      var/*float*/ linesMainDim = 0;
      var/*int*/ linesCount = 0;
      while (endLine < childCount) {
        // <Loop A> Layout non flexible children and count children by type

        // mainContentDim is accumulation of the dimensions and margin of all the
        // non flexible children. This will be used in order to either set the
        // dimensions of the node if none already exist, or to compute the
        // remaining space left for the flexible children.
        var/*float*/ mainContentDim = 0;

        // There are three kind of children, non flexible, flexible and absolute.
        // We need to know how many there are in order to distribute the space.
        var/*int*/ flexibleChildrenCount = 0;
        var/*float*/ totalFlexible = 0;
        var/*int*/ nonFlexibleChildrenCount = 0;

        // Use the line loop to position children in the main axis for as long
        // as they are using a simple stacking behaviour. Children that are
        // immediately stacked in the initial loop will not be touched again
        // in <Loop C>.
        var/*bool*/ isSimpleStackMain =
            (isMainDimDefined && justifyContent === CSS_JUSTIFY_FLEX_START) ||
            (!isMainDimDefined && justifyContent !== CSS_JUSTIFY_CENTER);
        var/*int*/ firstComplexMain = (isSimpleStackMain ? childCount : startLine);

        // Use the initial line loop to position children in the cross axis for
        // as long as they are relatively positioned with alignment STRETCH or
        // FLEX_START. Children that are immediately stacked in the initial loop
        // will not be touched again in <Loop D>.
        var/*bool*/ isSimpleStackCross = true;
        var/*int*/ firstComplexCross = childCount;

        var/*css_node_t**/ firstFlexChild = null;
        var/*css_node_t**/ currentFlexChild = null;

        var/*float*/ mainDim = leadingPaddingAndBorderMain;
        var/*float*/ crossDim = 0;

        var/*float*/ maxWidth;
        var/*float*/ maxHeight;
        for (i = startLine; i < childCount; ++i) {
          child = node.children[i];
          child.lineIndex = linesCount;

          child.nextAbsoluteChild = null;
          child.nextFlexChild = null;

          var/*css_align_t*/ alignItem = getAlignItem(node, child);

          // Pre-fill cross axis dimensions when the child is using stretch before
          // we call the recursive layout pass
          if (alignItem === CSS_ALIGN_STRETCH &&
              getPositionType(child) === CSS_POSITION_RELATIVE &&
              isCrossDimDefined &&
              !isDimDefined(child, crossAxis)) {
            child.layout[dim[crossAxis]] = fmaxf(
              boundAxis(child, crossAxis, node.layout[dim[crossAxis]] -
                paddingAndBorderAxisCross - getMarginAxis(child, crossAxis)),
              // You never want to go smaller than padding
              getPaddingAndBorderAxis(child, crossAxis)
            );
          } else if (getPositionType(child) === CSS_POSITION_ABSOLUTE) {
            // Store a private linked list of absolutely positioned children
            // so that we can efficiently traverse them later.
            if (firstAbsoluteChild === null) {
              firstAbsoluteChild = child;
            }
            if (currentAbsoluteChild !== null) {
              currentAbsoluteChild.nextAbsoluteChild = child;
            }
            currentAbsoluteChild = child;

            // Pre-fill dimensions when using absolute position and both offsets for the axis are defined (either both
            // left and right or top and bottom).
            for (ii = 0; ii < 2; ii++) {
              axis = (ii !== 0) ? CSS_FLEX_DIRECTION_ROW : CSS_FLEX_DIRECTION_COLUMN;
              if (!isUndefined(node.layout[dim[axis]]) &&
                  !isDimDefined(child, axis) &&
                  isPosDefined(child, leading[axis]) &&
                  isPosDefined(child, trailing[axis])) {
                child.layout[dim[axis]] = fmaxf(
                  boundAxis(child, axis, node.layout[dim[axis]] -
                    getPaddingAndBorderAxis(node, axis) -
                    getMarginAxis(child, axis) -
                    getPosition(child, leading[axis]) -
                    getPosition(child, trailing[axis])),
                  // You never want to go smaller than padding
                  getPaddingAndBorderAxis(child, axis)
                );
              }
            }
          }

          var/*float*/ nextContentDim = 0;

          // It only makes sense to consider a child flexible if we have a computed
          // dimension for the node.
          if (isMainDimDefined && isFlex(child)) {
            flexibleChildrenCount++;
            totalFlexible += child.style.flex;

            // Store a private linked list of flexible children so that we can
            // efficiently traverse them later.
            if (firstFlexChild === null) {
              firstFlexChild = child;
            }
            if (currentFlexChild !== null) {
              currentFlexChild.nextFlexChild = child;
            }
            currentFlexChild = child;

            // Even if we don't know its exact size yet, we already know the padding,
            // border and margin. We'll use this partial information, which represents
            // the smallest possible size for the child, to compute the remaining
            // available space.
            nextContentDim = getPaddingAndBorderAxis(child, mainAxis) +
              getMarginAxis(child, mainAxis);

          } else {
            maxWidth = CSS_UNDEFINED;
            maxHeight = CSS_UNDEFINED;

            if (!isMainRowDirection) {
              if (isDimDefined(node, resolvedRowAxis)) {
                maxWidth = node.layout[dim[resolvedRowAxis]] -
                  paddingAndBorderAxisResolvedRow;
              } else {
                maxWidth = parentMaxWidth -
                  getMarginAxis(node, resolvedRowAxis) -
                  paddingAndBorderAxisResolvedRow;
              }
            } else {
              if (isDimDefined(node, CSS_FLEX_DIRECTION_COLUMN)) {
                maxHeight = node.layout[dim[CSS_FLEX_DIRECTION_COLUMN]] -
                    paddingAndBorderAxisColumn;
              } else {
                maxHeight = parentMaxHeight -
                  getMarginAxis(node, CSS_FLEX_DIRECTION_COLUMN) -
                  paddingAndBorderAxisColumn;
              }
            }

            // This is the main recursive call. We layout non flexible children.
            if (alreadyComputedNextLayout === 0) {
              layoutNode(/*(java)!layoutContext, */child, maxWidth, maxHeight, direction);
            }

            // Absolute positioned elements do not take part of the layout, so we
            // don't use them to compute mainContentDim
            if (getPositionType(child) === CSS_POSITION_RELATIVE) {
              nonFlexibleChildrenCount++;
              // At this point we know the final size and margin of the element.
              nextContentDim = getDimWithMargin(child, mainAxis);
            }
          }

          // The element we are about to add would make us go to the next line
          if (isNodeFlexWrap &&
              isMainDimDefined &&
              mainContentDim + nextContentDim > definedMainDim &&
              // If there's only one element, then it's bigger than the content
              // and needs its own line
              i !== startLine) {
            nonFlexibleChildrenCount--;
            alreadyComputedNextLayout = 1;
            break;
          }

          // Disable simple stacking in the main axis for the current line as
          // we found a non-trivial child. The remaining children will be laid out
          // in <Loop C>.
          if (isSimpleStackMain &&
              (getPositionType(child) !== CSS_POSITION_RELATIVE || isFlex(child))) {
            isSimpleStackMain = false;
            firstComplexMain = i;
          }

          // Disable simple stacking in the cross axis for the current line as
          // we found a non-trivial child. The remaining children will be laid out
          // in <Loop D>.
          if (isSimpleStackCross &&
              (getPositionType(child) !== CSS_POSITION_RELATIVE ||
                  (alignItem !== CSS_ALIGN_STRETCH && alignItem !== CSS_ALIGN_FLEX_START) ||
                  isUndefined(child.layout[dim[crossAxis]]))) {
            isSimpleStackCross = false;
            firstComplexCross = i;
          }

          if (isSimpleStackMain) {
            child.layout[pos[mainAxis]] += mainDim;
            if (isMainDimDefined) {
              setTrailingPosition(node, child, mainAxis);
            }

            mainDim += getDimWithMargin(child, mainAxis);
            crossDim = fmaxf(crossDim, boundAxis(child, crossAxis, getDimWithMargin(child, crossAxis)));
          }

          if (isSimpleStackCross) {
            child.layout[pos[crossAxis]] += linesCrossDim + leadingPaddingAndBorderCross;
            if (isCrossDimDefined) {
              setTrailingPosition(node, child, crossAxis);
            }
          }

          alreadyComputedNextLayout = 0;
          mainContentDim += nextContentDim;
          endLine = i + 1;
        }

        // <Loop B> Layout flexible children and allocate empty space

        // In order to position the elements in the main axis, we have two
        // controls. The space between the beginning and the first element
        // and the space between each two elements.
        var/*float*/ leadingMainDim = 0;
        var/*float*/ betweenMainDim = 0;

        // The remaining available space that needs to be allocated
        var/*float*/ remainingMainDim = 0;
        if (isMainDimDefined) {
          remainingMainDim = definedMainDim - mainContentDim;
        } else {
          remainingMainDim = fmaxf(mainContentDim, 0) - mainContentDim;
        }

        // If there are flexible children in the mix, they are going to fill the
        // remaining space
        if (flexibleChildrenCount !== 0) {
          var/*float*/ flexibleMainDim = remainingMainDim / totalFlexible;
          var/*float*/ baseMainDim;
          var/*float*/ boundMainDim;

          // If the flex share of remaining space doesn't meet min/max bounds,
          // remove this child from flex calculations.
          currentFlexChild = firstFlexChild;
          while (currentFlexChild !== null) {
            baseMainDim = flexibleMainDim * currentFlexChild.style.flex +
                getPaddingAndBorderAxis(currentFlexChild, mainAxis);
            boundMainDim = boundAxis(currentFlexChild, mainAxis, baseMainDim);

            if (baseMainDim !== boundMainDim) {
              remainingMainDim -= boundMainDim;
              totalFlexible -= currentFlexChild.style.flex;
            }

            currentFlexChild = currentFlexChild.nextFlexChild;
          }
          flexibleMainDim = remainingMainDim / totalFlexible;

          // The non flexible children can overflow the container, in this case
          // we should just assume that there is no space available.
          if (flexibleMainDim < 0) {
            flexibleMainDim = 0;
          }

          currentFlexChild = firstFlexChild;
          while (currentFlexChild !== null) {
            // At this point we know the final size of the element in the main
            // dimension
            currentFlexChild.layout[dim[mainAxis]] = boundAxis(currentFlexChild, mainAxis,
              flexibleMainDim * currentFlexChild.style.flex +
                  getPaddingAndBorderAxis(currentFlexChild, mainAxis)
            );

            maxWidth = CSS_UNDEFINED;
            if (isDimDefined(node, resolvedRowAxis)) {
              maxWidth = node.layout[dim[resolvedRowAxis]] -
                paddingAndBorderAxisResolvedRow;
            } else if (!isMainRowDirection) {
              maxWidth = parentMaxWidth -
                getMarginAxis(node, resolvedRowAxis) -
                paddingAndBorderAxisResolvedRow;
            }
            maxHeight = CSS_UNDEFINED;
            if (isDimDefined(node, CSS_FLEX_DIRECTION_COLUMN)) {
              maxHeight = node.layout[dim[CSS_FLEX_DIRECTION_COLUMN]] -
                paddingAndBorderAxisColumn;
            } else if (isMainRowDirection) {
              maxHeight = parentMaxHeight -
                getMarginAxis(node, CSS_FLEX_DIRECTION_COLUMN) -
                paddingAndBorderAxisColumn;
            }

            // And we recursively call the layout algorithm for this child
            layoutNode(/*(java)!layoutContext, */currentFlexChild, maxWidth, maxHeight, direction);

            child = currentFlexChild;
            currentFlexChild = currentFlexChild.nextFlexChild;
            child.nextFlexChild = null;
          }

        // We use justifyContent to figure out how to allocate the remaining
        // space available
        } else if (justifyContent !== CSS_JUSTIFY_FLEX_START) {
          if (justifyContent === CSS_JUSTIFY_CENTER) {
            leadingMainDim = remainingMainDim / 2;
          } else if (justifyContent === CSS_JUSTIFY_FLEX_END) {
            leadingMainDim = remainingMainDim;
          } else if (justifyContent === CSS_JUSTIFY_SPACE_BETWEEN) {
            remainingMainDim = fmaxf(remainingMainDim, 0);
            if (flexibleChildrenCount + nonFlexibleChildrenCount - 1 !== 0) {
              betweenMainDim = remainingMainDim /
                (flexibleChildrenCount + nonFlexibleChildrenCount - 1);
            } else {
              betweenMainDim = 0;
            }
          } else if (justifyContent === CSS_JUSTIFY_SPACE_AROUND) {
            // Space on the edges is half of the space between elements
            betweenMainDim = remainingMainDim /
              (flexibleChildrenCount + nonFlexibleChildrenCount);
            leadingMainDim = betweenMainDim / 2;
          }
        }

        // <Loop C> Position elements in the main axis and compute dimensions

        // At this point, all the children have their dimensions set. We need to
        // find their position. In order to do that, we accumulate data in
        // variables that are also useful to compute the total dimensions of the
        // container!
        mainDim += leadingMainDim;

        for (i = firstComplexMain; i < endLine; ++i) {
          child = node.children[i];

          if (getPositionType(child) === CSS_POSITION_ABSOLUTE &&
              isPosDefined(child, leading[mainAxis])) {
            // In case the child is position absolute and has left/top being
            // defined, we override the position to whatever the user said
            // (and margin/border).
            child.layout[pos[mainAxis]] = getPosition(child, leading[mainAxis]) +
              getLeadingBorder(node, mainAxis) +
              getLeadingMargin(child, mainAxis);
          } else {
            // If the child is position absolute (without top/left) or relative,
            // we put it at the current accumulated offset.
            child.layout[pos[mainAxis]] += mainDim;

            // Define the trailing position accordingly.
            if (isMainDimDefined) {
              setTrailingPosition(node, child, mainAxis);
            }

            // Now that we placed the element, we need to update the variables
            // We only need to do that for relative elements. Absolute elements
            // do not take part in that phase.
            if (getPositionType(child) === CSS_POSITION_RELATIVE) {
              // The main dimension is the sum of all the elements dimension plus
              // the spacing.
              mainDim += betweenMainDim + getDimWithMargin(child, mainAxis);
              // The cross dimension is the max of the elements dimension since there
              // can only be one element in that cross dimension.
              crossDim = fmaxf(crossDim, boundAxis(child, crossAxis, getDimWithMargin(child, crossAxis)));
            }
          }
        }

        var/*float*/ containerCrossAxis = node.layout[dim[crossAxis]];
        if (!isCrossDimDefined) {
          containerCrossAxis = fmaxf(
            // For the cross dim, we add both sides at the end because the value
            // is aggregate via a max function. Intermediate negative values
            // can mess this computation otherwise
            boundAxis(node, crossAxis, crossDim + paddingAndBorderAxisCross),
            paddingAndBorderAxisCross
          );
        }

        // <Loop D> Position elements in the cross axis
        for (i = firstComplexCross; i < endLine; ++i) {
          child = node.children[i];

          if (getPositionType(child) === CSS_POSITION_ABSOLUTE &&
              isPosDefined(child, leading[crossAxis])) {
            // In case the child is absolutely positionned and has a
            // top/left/bottom/right being set, we override all the previously
            // computed positions to set it correctly.
            child.layout[pos[crossAxis]] = getPosition(child, leading[crossAxis]) +
              getLeadingBorder(node, crossAxis) +
              getLeadingMargin(child, crossAxis);

          } else {
            var/*float*/ leadingCrossDim = leadingPaddingAndBorderCross;

            // For a relative children, we're either using alignItems (parent) or
            // alignSelf (child) in order to determine the position in the cross axis
            if (getPositionType(child) === CSS_POSITION_RELATIVE) {
              /*eslint-disable */
              // This variable is intentionally re-defined as the code is transpiled to a block scope language
              var/*css_align_t*/ alignItem = getAlignItem(node, child);
              /*eslint-enable */
              if (alignItem === CSS_ALIGN_STRETCH) {
                // You can only stretch if the dimension has not already been set
                // previously.
                if (isUndefined(child.layout[dim[crossAxis]])) {
                  child.layout[dim[crossAxis]] = fmaxf(
                    boundAxis(child, crossAxis, containerCrossAxis -
                      paddingAndBorderAxisCross - getMarginAxis(child, crossAxis)),
                    // You never want to go smaller than padding
                    getPaddingAndBorderAxis(child, crossAxis)
                  );
                }
              } else if (alignItem !== CSS_ALIGN_FLEX_START) {
                // The remaining space between the parent dimensions+padding and child
                // dimensions+margin.
                var/*float*/ remainingCrossDim = containerCrossAxis -
                  paddingAndBorderAxisCross - getDimWithMargin(child, crossAxis);

                if (alignItem === CSS_ALIGN_CENTER) {
                  leadingCrossDim += remainingCrossDim / 2;
                } else { // CSS_ALIGN_FLEX_END
                  leadingCrossDim += remainingCrossDim;
                }
              }
            }

            // And we apply the position
            child.layout[pos[crossAxis]] += linesCrossDim + leadingCrossDim;

            // Define the trailing position accordingly.
            if (isCrossDimDefined) {
              setTrailingPosition(node, child, crossAxis);
            }
          }
        }

        linesCrossDim += crossDim;
        linesMainDim = fmaxf(linesMainDim, mainDim);
        linesCount += 1;
        startLine = endLine;
      }

      // <Loop E>
      //
      // Note(prenaux): More than one line, we need to layout the crossAxis
      // according to alignContent.
      //
      // Note that we could probably remove <Loop D> and handle the one line case
      // here too, but for the moment this is safer since it won't interfere with
      // previously working code.
      //
      // See specs:
      // http://www.w3.org/TR/2012/CR-css3-flexbox-20120918/#layout-algorithm
      // section 9.4
      //
      if (linesCount > 1 && isCrossDimDefined) {
        var/*float*/ nodeCrossAxisInnerSize = node.layout[dim[crossAxis]] -
            paddingAndBorderAxisCross;
        var/*float*/ remainingAlignContentDim = nodeCrossAxisInnerSize - linesCrossDim;

        var/*float*/ crossDimLead = 0;
        var/*float*/ currentLead = leadingPaddingAndBorderCross;

        var/*css_align_t*/ alignContent = getAlignContent(node);
        if (alignContent === CSS_ALIGN_FLEX_END) {
          currentLead += remainingAlignContentDim;
        } else if (alignContent === CSS_ALIGN_CENTER) {
          currentLead += remainingAlignContentDim / 2;
        } else if (alignContent === CSS_ALIGN_STRETCH) {
          if (nodeCrossAxisInnerSize > linesCrossDim) {
            crossDimLead = (remainingAlignContentDim / linesCount);
          }
        }

        var/*int*/ endIndex = 0;
        for (i = 0; i < linesCount; ++i) {
          var/*int*/ startIndex = endIndex;

          // compute the line's height and find the endIndex
          var/*float*/ lineHeight = 0;
          for (ii = startIndex; ii < childCount; ++ii) {
            child = node.children[ii];
            if (getPositionType(child) !== CSS_POSITION_RELATIVE) {
              continue;
            }
            if (child.lineIndex !== i) {
              break;
            }
            if (!isUndefined(child.layout[dim[crossAxis]])) {
              lineHeight = fmaxf(
                lineHeight,
                child.layout[dim[crossAxis]] + getMarginAxis(child, crossAxis)
              );
            }
          }
          endIndex = ii;
          lineHeight += crossDimLead;

          for (ii = startIndex; ii < endIndex; ++ii) {
            child = node.children[ii];
            if (getPositionType(child) !== CSS_POSITION_RELATIVE) {
              continue;
            }

            var/*css_align_t*/ alignContentAlignItem = getAlignItem(node, child);
            if (alignContentAlignItem === CSS_ALIGN_FLEX_START) {
              child.layout[pos[crossAxis]] = currentLead + getLeadingMargin(child, crossAxis);
            } else if (alignContentAlignItem === CSS_ALIGN_FLEX_END) {
              child.layout[pos[crossAxis]] = currentLead + lineHeight - getTrailingMargin(child, crossAxis) - child.layout[dim[crossAxis]];
            } else if (alignContentAlignItem === CSS_ALIGN_CENTER) {
              var/*float*/ childHeight = child.layout[dim[crossAxis]];
              child.layout[pos[crossAxis]] = currentLead + (lineHeight - childHeight) / 2;
            } else if (alignContentAlignItem === CSS_ALIGN_STRETCH) {
              child.layout[pos[crossAxis]] = currentLead + getLeadingMargin(child, crossAxis);
              // TODO(prenaux): Correctly set the height of items with undefined
              //                (auto) crossAxis dimension.
            }
          }

          currentLead += lineHeight;
        }
      }

      var/*bool*/ needsMainTrailingPos = false;
      var/*bool*/ needsCrossTrailingPos = false;

      // If the user didn't specify a width or height, and it has not been set
      // by the container, then we set it via the children.
      if (!isMainDimDefined) {
        node.layout[dim[mainAxis]] = fmaxf(
          // We're missing the last padding at this point to get the final
          // dimension
          boundAxis(node, mainAxis, linesMainDim + getTrailingPaddingAndBorder(node, mainAxis)),
          // We can never assign a width smaller than the padding and borders
          paddingAndBorderAxisMain
        );

        if (mainAxis === CSS_FLEX_DIRECTION_ROW_REVERSE ||
            mainAxis === CSS_FLEX_DIRECTION_COLUMN_REVERSE) {
          needsMainTrailingPos = true;
        }
      }

      if (!isCrossDimDefined) {
        node.layout[dim[crossAxis]] = fmaxf(
          // For the cross dim, we add both sides at the end because the value
          // is aggregate via a max function. Intermediate negative values
          // can mess this computation otherwise
          boundAxis(node, crossAxis, linesCrossDim + paddingAndBorderAxisCross),
          paddingAndBorderAxisCross
        );

        if (crossAxis === CSS_FLEX_DIRECTION_ROW_REVERSE ||
            crossAxis === CSS_FLEX_DIRECTION_COLUMN_REVERSE) {
          needsCrossTrailingPos = true;
        }
      }

      // <Loop F> Set trailing position if necessary
      if (needsMainTrailingPos || needsCrossTrailingPos) {
        for (i = 0; i < childCount; ++i) {
          child = node.children[i];

          if (needsMainTrailingPos) {
            setTrailingPosition(node, child, mainAxis);
          }

          if (needsCrossTrailingPos) {
            setTrailingPosition(node, child, crossAxis);
          }
        }
      }

      // <Loop G> Calculate dimensions for absolutely positioned elements
      currentAbsoluteChild = firstAbsoluteChild;
      while (currentAbsoluteChild !== null) {
        // Pre-fill dimensions when using absolute position and both offsets for
        // the axis are defined (either both left and right or top and bottom).
        for (ii = 0; ii < 2; ii++) {
          axis = (ii !== 0) ? CSS_FLEX_DIRECTION_ROW : CSS_FLEX_DIRECTION_COLUMN;

          if (!isUndefined(node.layout[dim[axis]]) &&
              !isDimDefined(currentAbsoluteChild, axis) &&
              isPosDefined(currentAbsoluteChild, leading[axis]) &&
              isPosDefined(currentAbsoluteChild, trailing[axis])) {
            currentAbsoluteChild.layout[dim[axis]] = fmaxf(
              boundAxis(currentAbsoluteChild, axis, node.layout[dim[axis]] -
                getBorderAxis(node, axis) -
                getMarginAxis(currentAbsoluteChild, axis) -
                getPosition(currentAbsoluteChild, leading[axis]) -
                getPosition(currentAbsoluteChild, trailing[axis])
              ),
              // You never want to go smaller than padding
              getPaddingAndBorderAxis(currentAbsoluteChild, axis)
            );
          }

          if (isPosDefined(currentAbsoluteChild, trailing[axis]) &&
              !isPosDefined(currentAbsoluteChild, leading[axis])) {
            currentAbsoluteChild.layout[leading[axis]] =
              node.layout[dim[axis]] -
              currentAbsoluteChild.layout[dim[axis]] -
              getPosition(currentAbsoluteChild, trailing[axis]);
          }
        }

        child = currentAbsoluteChild;
        currentAbsoluteChild = currentAbsoluteChild.nextAbsoluteChild;
        child.nextAbsoluteChild = null;
      }
    }

    function layoutNode(node, parentMaxWidth, parentMaxHeight, parentDirection) {
      node.shouldUpdate = true;

      var direction = node.style.direction || CSS_DIRECTION_LTR;
      var skipLayout =
        !node.isDirty &&
        node.lastLayout &&
        node.lastLayout.requestedHeight === node.layout.height &&
        node.lastLayout.requestedWidth === node.layout.width &&
        node.lastLayout.parentMaxWidth === parentMaxWidth &&
        node.lastLayout.parentMaxHeight === parentMaxHeight &&
        node.lastLayout.direction === direction;

      if (skipLayout) {
        node.layout.width = node.lastLayout.width;
        node.layout.height = node.lastLayout.height;
        node.layout.top = node.lastLayout.top;
        node.layout.left = node.lastLayout.left;
      } else {
        if (!node.lastLayout) {
          node.lastLayout = {};
        }

        node.lastLayout.requestedWidth = node.layout.width;
        node.lastLayout.requestedHeight = node.layout.height;
        node.lastLayout.parentMaxWidth = parentMaxWidth;
        node.lastLayout.parentMaxHeight = parentMaxHeight;
        node.lastLayout.direction = direction;

        // Reset child layouts
        node.children.forEach(function(child) {
          child.layout.width = undefined;
          child.layout.height = undefined;
          child.layout.top = 0;
          child.layout.left = 0;
        });

        layoutNodeImpl(node, parentMaxWidth, parentMaxHeight, parentDirection);

        node.lastLayout.width = node.layout.width;
        node.lastLayout.height = node.layout.height;
        node.lastLayout.top = node.layout.top;
        node.lastLayout.left = node.layout.left;
      }
    }

    return {
      layoutNodeImpl: layoutNodeImpl,
      computeLayout: layoutNode,
      fillNodes: fillNodes
    };
  })();

  // This module export is only used for the purposes of unit testing this file. When
  // the library is packaged this file is included within css-layout.js which forms
  // the public API.
  if (typeof exports === 'object') {
    module.exports = computeLayout;
  }


    return function(node) {
      /*eslint-disable */
      // disabling ESLint because this code relies on the above include
      computeLayout.fillNodes(node);
      computeLayout.computeLayout(node);
      /*eslint-enable */
    };
  }));

  !window.addEventListener && window.attachEvent && (function () {
    Window.prototype.addEventListener = HTMLDocument.prototype.addEventListener = Element.prototype.addEventListener = function addEventListener(type, listener) {
      this.attachEvent('on' + type, listener);
    };

    Window.prototype.removeEventListener = HTMLDocument.prototype.removeEventListener = Element.prototype.removeEventListener = function removeEventListener(type, listener) {
      this.detachEvent('on' + type, listener);
    };
  })();

  flexibility.detect = function detect() {
    var node = document.createElement('p');

    try {
      node.style.display = 'flex';

      return node.style.display === 'flex';
    } catch (error) {
      return false;
    }
  };

  if (!flexibility.detect() && document.attachEvent && document.documentElement.currentStyle) {
    document.attachEvent('onreadystatechange', function () {
      flexibility.onresize({
        target: document.documentElement
      });
    });
  }

  flexibility.init = function init(node) {
    // get details from node
    var details = node.onlayoutcomplete;

    // conditionally generate details
    if (!details) {
      details = node.onlayoutcomplete = {
        node:     node,
        style:    {},
        children: []
      };
    }

    // store display style in details
    details.style.display = node.currentStyle['-js-display'] || node.currentStyle.display;

    // return details
    return details;
  };

  // define delay
  var SECOND = 1000;
  var FRAMES_PER_SECOND = 15;
  var VIEWPORT_ELEMENT = document.documentElement;
  var VIEWPORT_WIDTH = 0;
  var VIEWPORT_HEIGHT = 0;
  var TIMEOUT;

  flexibility.onresize = function resize(event) {
    // if the screen width has changed
    if (VIEWPORT_ELEMENT.clientWidth !== VIEWPORT_WIDTH || VIEWPORT_ELEMENT.clientHeight !== VIEWPORT_HEIGHT) {
      // update the cached screen width
      VIEWPORT_WIDTH = VIEWPORT_ELEMENT.clientWidth;
      VIEWPORT_HEIGHT = VIEWPORT_ELEMENT.clientHeight;

      // clear existing timeouts
      clearTimeout(TIMEOUT);

      // remove resize listener
      window.removeEventListener('resize', flexibility.onresize);

      // get resize target
      var target = event.target && event.target.nodeType === 1 ? event.target : document.documentElement;

      // walk resize target
      flexibility.walk(target);

      // restore resize listener
      TIMEOUT = setTimeout(function () {
        window.addEventListener('resize', flexibility.onresize);
      }, SECOND / FRAMES_PER_SECOND);
    }
  };

  var CSS_FLEX_CONTAINER_PROPERTIES = {
    alignContent: {
      initial: 'stretch',
      valid:   /^(flex-start|flex-end|center|space-between|space-around|stretch)/
    },
    alignItems: {
      initial: 'stretch',
      valid:   /^(flex-start|flex-end|center|baseline|stretch)$/
    },
    boxSizing: {
      initial: 'content-box',
      valid: /^(border-box|content-box)$/
    },
    flexDirection: {
      initial: 'row',
      valid:   /^(row|row-reverse|column|column-reverse)$/
    },
    flexWrap: {
      initial: 'nowrap',
      valid:   /^(nowrap|wrap|wrap-reverse)$/
    },
    justifyContent: {
      initial: 'flex-start',
      valid:   /^(flex-start|flex-end|center|space-between|space-around)$/
    }
  };

  flexibility.updateFlexContainerCache = function updateFlexContainerCache(details) {
    // get style details
    var style  = details.style;
    var getCSS = details.node.currentStyle;
    var ie9CSS = details.node.style;
    var ffbCSS = {};

    // flex-flow
    (getCSS['flex-flow'] || ie9CSS['flex-flow'] || '').replace(/^(row|row-reverse|column|column-reverse)\s+(nowrap|wrap|wrap-reverse)$/i, function ($0, flexDirection, flexWrap) {
      ffbCSS.flexDirection = flexDirection;
      ffbCSS.flexWrap = flexWrap;
    });

    // store each flex container property value
    for (var key in CSS_FLEX_CONTAINER_PROPERTIES) {
      var kabobKey = key.replace(/[A-Z]/g, '-$&').toLowerCase();
      var keyValue = CSS_FLEX_CONTAINER_PROPERTIES[key];
      var cssValue = getCSS[kabobKey] || ie9CSS[kabobKey];

      style[key] = keyValue.valid.test(cssValue) ? cssValue : ffbCSS[key] || keyValue.initial;
    }
  };

  var CSS_FLEX_ITEM_PROPERTIES = {
    alignSelf: {
      initial: 'auto',
      valid:   /^(auto|flex-start|flex-end|center|baseline|stretch)$/
    },
    boxSizing: {
      initial: 'content-box',
      valid: /^(border-box|content-box)$/
    },
    flexBasis: {
      initial: 'auto',
      valid:   /^((?:[-+]?0|[-+]?[0-9]*\.?[0-9]+(?:%|ch|cm|em|ex|in|mm|pc|pt|px|rem|vh|vmax|vmin|vw))|auto|fill|max-content|min-content|fit-content|content)$/
    },
    flexGrow: {
      initial: 0,
      valid:   /^\+?(0|[1-9][0-9]*)$/
    },
    flexShrink: {
      initial: 0,
      valid:   /^\+?(0|[1-9][0-9]*)$/
    },
    order: {
      initial: 0,
      valid:   /^([-+]?[0-9]+)$/
    }
  };

  flexibility.updateFlexItemCache = function updateFlexItemCache(details) {
    // get style details
    var style  = details.style;
    var getCSS = details.node.currentStyle;
    var ie9CSS = details.node.style;
    var ffbCSS = {};

    // flex
    (getCSS.flex || ie9CSS.flex || '').replace(/^\+?(0|[1-9][0-9]*)/, function ($0) {
      ffbCSS.flexGrow = $0;
    });

    // store each flex item property value
    for (var key in CSS_FLEX_ITEM_PROPERTIES) {
      var kabobKey = key.replace(/[A-Z]/g, '-$&').toLowerCase();
      var keyValue = CSS_FLEX_ITEM_PROPERTIES[key];
      var cssValue = getCSS[kabobKey] || ie9CSS[kabobKey];

      style[key] = keyValue.valid.test(cssValue) ? cssValue : ffbCSS[key] || keyValue.initial;

      if (typeof keyValue.initial === 'number') {
        style[key] = parseFloat(style[key]);
      }
    }
  };

  var CSS_RESET_TEXT = 'border:0 solid;clip:rect(0 0 0 0);display:inline-block;font:0/0 serif;margin:0;max-height:none;max-width:none;min-height:0;min-width:0;overflow:hidden;padding:0;position:absolute;width:1em;';

  var CSS_BORDER_WIDTHS = {
    medium: 4,
    none:   0,
    thick:  6,
    thin:   2
  };

  var CSS_LENGTHS = {
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    height: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    maxHeight: 0,
    maxWidth: 0,
    minHeight: 0,
    minWidth: 0,
    width: 0
  };

  var CSS_LENGTH_REGEX = /^([-+]?0|[-+]?[0-9]*\.?[0-9]+)/;

  var CSS_FULL_LENGTH = 100;

  flexibility.updateLengthCache = function updateLengthCache(details) {
    // get style details
    var node = details.node;
    var style = details.style;

    // get node parent
    var parentNode  = node.parentNode;
    var parentWidth;
    var parentHeight;
    var parentLength;

    // create clone element
    var clonex = document.createElement('_');

    var setCSS = clonex.runtimeStyle;

    var getCSS = node.currentStyle;

    setCSS.cssText = CSS_RESET_TEXT + 'font-size:' + getCSS.fontSize;

    // insert clone after node
    parentNode.insertBefore(clonex, node.nextSibling);

    style.fontSize = clonex.offsetWidth;

    setCSS.fontSize = style.fontSize + 'px';

    for (var key in CSS_LENGTHS) {
      var cssValue = getCSS[key];

      // if the value is a length or if it is "auto" not on width or height
      if (CSS_LENGTH_REGEX.test(cssValue) || cssValue === 'auto' && !/(width|height)/i.test(key)) {
        // if the value is a percentage length
        if (/%$/.test(cssValue)) {
          // cache the appropriate parent metric
          if (/^(bottom|height|top)$/.test(key)) {
            if (!parentHeight) {
              parentHeight = parentNode.offsetHeight;
            }

            parentLength = parentHeight;
          } else {
            if (!parentWidth) {
              parentWidth = parentNode.offsetWidth;
            }

            parentLength = parentWidth;
          }

          style[key] = parseFloat(cssValue) * parentLength / CSS_FULL_LENGTH;
        } else {
          setCSS.width = cssValue;

          style[key] = clonex.offsetWidth;
        }
      } else if (/^border/.test(key) && cssValue in CSS_BORDER_WIDTHS) {
        style[key] = CSS_BORDER_WIDTHS[cssValue];
      } else {
        delete style[key];
      }
    }

    // remove clone
    parentNode.removeChild(clonex);

    // redefine borders without style
    if (getCSS.borderTopStyle    === 'none') {
      style.borderTopWidth    = 0;
    }

    if (getCSS.borderRightStyle  === 'none') {
      style.borderRightWidth  = 0;
    }

    if (getCSS.borderBottomStyle === 'none') {
      style.borderBottomWidth = 0;
    }

    if (getCSS.borderLeftStyle   === 'none') {
      style.borderLeftWidth   = 0;
    }

    // provide width and height fallbacks
    if (!style.width && !style.minWidth) {
      if (/flex/.test(style.display)) {
        style.width = node.offsetWidth;
      } else {
        style.minWidth = node.offsetWidth;
      }
    }

    // provide width and height fallbacks
    if (!style.height && !style.minHeight) {
      if (!/flex/.test(style.display)) {
        style.minHeight = node.offsetHeight;
      }
    }
  };

  flexibility.walk = function walk(node) {
    // initialize node
    var details = flexibility.init(node);

    // get display
    var style   = details.style;
    var display = style.display;

    // skip display:none elements
    if (display === 'none') {
      return {};
    }

    // detect flex
    var isFlex  = display.match(/^(inline)?flex$/);

    // conditionally style flex container
    if (isFlex) {
      flexibility.updateFlexContainerCache(details);

      node.runtimeStyle.cssText = 'display:' + (isFlex[1] ? 'inline-block' : 'block');

      details.children = [];
    }

    // walk children of the current node
    Array.prototype.forEach.call(node.childNodes, function (childNode, childNodeIndex) {
      // if the child is an element
      if (childNode.nodeType === 1) {
        // walk the child element
        var childDetails = flexibility.walk(childNode);
        var childStyle   = childDetails.style;

        childDetails.index = childNodeIndex;

        // if the parent is a flex container
        if (isFlex) {
          // get the flex item styles
          flexibility.updateFlexItemCache(childDetails);

          // inherit self alignment from container item alignment
          if (childStyle.alignSelf === 'auto') {
            childStyle.alignSelf = style.alignItems;
          }

          childStyle.flex = childStyle.flexGrow;

          // overwrite child runtime style
          childNode.runtimeStyle.cssText = 'display:inline-block';

          // add item to parent flex
          details.children.push(childDetails);
        }
      }
    });

    // if the element is a flex container
    if (isFlex) {
      // calculate each flex item length
      details.children.forEach(function (child) {
        flexibility.updateLengthCache(child);
      });

      // sort flex items by order or original position
      details.children.sort(function (childA, childB) {
        return childA.style.order - childB.style.order || childA.index - childB.index;
      });

      // if the flex container direction is reversed
      if (/-reverse$/.test(style.flexDirection)) {
        // reverse the flex item order
        details.children.reverse();

        // remove the flex container reversal
        style.flexDirection = style.flexDirection.replace(/-reverse$/, '');

        // conditionally flip flex container content justification
        if (style.justifyContent === 'flex-start') {
          style.justifyContent = 'flex-end';
        } else if (style.justifyContent === 'flex-end') {
          style.justifyContent = 'flex-start';
        }
      }

      // update flex container lengths
      flexibility.updateLengthCache(details);

      // remove old layout results
      delete details.lastLayout;
      delete details.layout;

      // CSS-LAYOUT PATCH: adjust border widths
      var borderTopWidth = style.borderTopWidth;
      var borderBottomWidth = style.borderBottomWidth;

      style.borderTopWidth = 0;
      style.borderBottomWidth = 0;
      style.borderLeftWidth = 0;

      if (style.flexDirection === 'column') {
        style.width -= style.borderRightWidth;
      }

      // calculate the layout
      flexibility.computeLayout(details);

      // style the flex container
      node.runtimeStyle.cssText = 'box-sizing:border-box;display:block;position:relative;width:' + (details.layout.width + style.borderRightWidth) + 'px;height:' + (details.layout.height + borderTopWidth + borderBottomWidth) + 'px';

      // CSS-LAYOUT PATCH: calculate stretched column width and height
      var maxLength = [];
      var maxIndex = 1;

      var angle = style.flexDirection === 'column' ? 'width' : 'height';

      details.children.forEach(function (child) {
        maxLength[child.lineIndex] = Math.max(maxLength[child.lineIndex] || 0, child.layout[angle]);

        maxIndex = Math.max(maxIndex, child.lineIndex + 1);
      });

      // style each flex item
      details.children.forEach(function (child) {
        var layout = child.layout;

        if (child.style.alignSelf === 'stretch') {
          layout[angle] = maxLength[child.lineIndex];
        }

        child.node.runtimeStyle.cssText = 'box-sizing:border-box;display:block;position:absolute;margin:0;width:' + layout.width + 'px;height:' + layout.height + 'px;top:' + layout.top + 'px;left:' + layout.left + 'px';
      });
    }

    return details;
  };
})();
