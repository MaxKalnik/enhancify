var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

RangeSliderField = (function() {
  RangeSliderField.prototype.DEFAULT_TYPE = 'default';

  RangeSliderField.prototype.KEY_CODES = {
    UP: 38,
    DOWN: 40
  };

  function RangeSliderField(options) {
    if (options == null) {
      options = {};
    }

    this._onInputBlur = bind(this._onInputBlur, this);
    this._onInputKeyDown = bind(this._onInputKeyDown, this);
    this._onInputFocus = bind(this._onInputFocus, this);
    this._onInputUpdate = bind(this._onInputUpdate, this);
    if (!options.DOMElement) {
      throw new Error("ERROR :: RangeSliderField class :: 'DOMElement' options is required");
    }
    if ($(options.DOMElement).data('component') != null) {
      return;
    }
    this.$rangeSlider = $(options.DOMElement).find('.range__slider');
    _.defaults(options, {
      type: this.DEFAULT_TYPE
    });
    this._init(options);
    this._addEventListeners();
    $(options.DOMElement).data('component', this);
  }

  RangeSliderField.prototype._init = function(options) {
    if (options == null) {
      options = {};
    }
    this._initUI();
    this._initData(options);
    this.parseFunction = this.data.type === 'apr' ? parseFloat : parseInt;
    this._initRangeSlider();
    return this._initRangeInput();
  };

  RangeSliderField.prototype._initUI = function() {
    this.ui = {};
    this.ui.$rangeBlock = this.$rangeSlider.closest('.range');
    return this.ui.$rangeInput = this.ui.$rangeBlock.find('.range__input');
  };

  RangeSliderField.prototype._initData = function(options) {
    this.data = {};
    this.data.type = options.type;
    this.data.defaultValue = this.$rangeSlider.data('from');
    this.data.maxValue = this.$rangeSlider.data('max');
    this.data.minValue = this.$rangeSlider.data('min');
    this.data.step = this.$rangeSlider.data('step');
    return this.callbacks = {};
  };

  RangeSliderField.prototype._initRangeSlider = function() {
    this.$rangeSlider.attr('tabindex', -1);
    this.$rangeSlider.ionRangeSlider({
      hide_min_max: true,
      hide_from_to: true,
      onChange: (function(_this) {
        return function(data) {
          _this._setValue(data.from);
          return _this._dirtySlider();
        };
      })(this),
      onStart: (function(_this) {
        return function(data) {
          return _this._setValue(_this.data.defaultValue);
        };
      })(this),
      onFinish: (function(_this) {
        return function() {
          _this.ui.$rangeInput.blur();
          return _this._unHighlightSlider();
        };
      })(this)
    });
    return this.$rangeSliderInstance = this.$rangeSlider.data('ionRangeSlider');
  };

  RangeSliderField.prototype._initRangeInput = function() {
    var specificOptions;
    specificOptions = this.data.type === 'apr' ? {
      alias: 'decimal',
      integerDigits: 33,
      suffix: '%'
    } : {
      alias: 'integer',
      integerDigits: 6,
      prefix: this.data.type === 'currency' ? '$ ' : ''
    };
    return this.ui.$rangeInput.inputmask($.extend(specificOptions, {
      autoGroup: true,
      groupSeparator: ',',
      allowMinus: false,
      min: this.data.minValue,
      max: this.data.maxValue,
      rightAlign: false
    }));
  };

  RangeSliderField.prototype._addEventListeners = function() {
    return this.ui.$rangeInput.on('input', this._onInputUpdate).on('blur', this._onInputBlur).on('focus', this._onInputFocus).on('keydown', this._onInputKeyDown);
  };

  RangeSliderField.prototype._onInputUpdate = function() {
    this.$rangeSliderInstance.update({
      from: this._getValue()
    });
    this._dirtySlider();
    return this._onChange();
  };

  RangeSliderField.prototype._onInputFocus = function() {
    return this._highlightSlider();
  };

  RangeSliderField.prototype._onInputKeyDown = function() {
    if (event.keyCode === this.KEY_CODES.UP) {
      this._setValue(parseInt(this._getValue()) + parseInt(this.data.step));
      return this.$rangeSliderInstance.update({
        from: this._getValue()
      });
    } else if (event.keyCode === this.KEY_CODES.DOWN) {
      this._setValue(parseInt(this._getValue()) - parseInt(this.data.step));
      return this.$rangeSliderInstance.update({
        from: this._getValue()
      });
    }
  };

  RangeSliderField.prototype._onInputBlur = function() {
    this._setValue(this._getValue());
    return this._unHighlightSlider();
  };

  RangeSliderField.prototype._onChange = function() {
    var base;
    if (typeof (base = this.callbacks).change === "function") {
      base.change(this.getCurrentValue({
        smart: true
      }), this);
    }
    return this._triggerOnChange();
  };

  RangeSliderField.prototype._getValue = function() {
    return this.ui.$rangeInput.inputmask('unmaskedvalue');
  };

  RangeSliderField.prototype._setValue = function(value) {
    this.ui.$rangeInput.val(value);
    return this._onChange();
  };

  RangeSliderField.prototype._highlightSlider = function() {
    // return this.ui.$rangeBlock.modify('range', 'focus', true);
    return this.ui.$rangeBlock.addClass('range--focus');
  };

  RangeSliderField.prototype._unHighlightSlider = function() {
    // return this.ui.$rangeBlock.modify('range', 'focus', false);
    return this.ui.$rangeBlock.removeClass('range--focus');
  };

  RangeSliderField.prototype._dirtySlider = function() {
    // return this.ui.$rangeBlock.modify('range', 'dirty', true);
    return this.ui.$rangeBlock.addClass('range--dirty');
  };

  RangeSliderField.prototype._unDirtySlider = function() {
    // return this.ui.$rangeBlock.modify('range', 'dirty', false);
    return this.ui.$rangeBlock.removeClass('range--dirty');
  };

  RangeSliderField.prototype._triggerOnChange = function() {
    return this.ui.$rangeInput.trigger('rangeInputChange', this.getCurrentValue(), this);
  };

  RangeSliderField.prototype._triggerOnMinChange = function() {
    return this.ui.$rangeInput.trigger('rangeInputMinChange', this.data.minValue, this);
  };

  RangeSliderField.prototype._triggerOnMaxChange = function() {
    return this.ui.$rangeInput.trigger('rangeInputMaxChange', this.data.maxValue, this);
  };

  RangeSliderField.prototype._valid = function() {
    var value;
    value = this.parseFunction(this._getValue());
    if (isNaN(value)) {
      return false;
    }
    return (this.data.minValue <= value && value <= this.data.maxValue);
  };

  RangeSliderField.prototype.getCurrentValue = function(options) {
    var stringValue, value;
    if (options == null) {
      options = {};
    }
    _.defaults(options, {
      smart: false
    });
    if (this._valid()) {
      return this.parseFunction(this._getValue());
    } else if (options.smart) {
      stringValue = this._getValue();
      value = stringValue === '' ? 0 : this.parseFunction(stringValue);
      if (isNaN(value)) {
        return null;
      }
      if (value > this.data.maxValue) {
        return this.data.maxValue;
      }
      if (value < this.data.minValue) {
        return this.data.minValue;
      }
    } else {
      return null;
    }
  };

  RangeSliderField.prototype.setValue = function(newValue) {
    newValue = this.parseFunction(newValue);
    if (isNaN(newValue)) {
      return;
    }
    if ((this.data.minValue <= newValue && newValue <= this.data.maxValue)) {
      this._setValue(newValue);
      this.$rangeSliderInstance.update({
        from: this._getValue()
      });
      return true;
    } else {
      return false;
    }
  };

  RangeSliderField.prototype.setMin = function(newMinValue) {
    var oldValue;
    newMinValue = this.parseFunction(newMinValue);
    if (isNaN(newMinValue)) {
      return;
    }
    oldValue = this._getValue();
    if (newMinValue > this.data.maxValue) {
      throw new Error("ERROR :: RangeSliderField class :: min value can't be grater then max value");
    }
    this.data.minValue = newMinValue;
    this.ui.$rangeInput.inputmask('option', {
      min: this.data.minValue
    });
    this.$rangeSliderInstance.update({
      min: this.data.minValue
    });
    this._triggerOnMinChange();
    if (oldValue !== this._getValue()) {
      return this._onChange();
    }
  };

  RangeSliderField.prototype.setMax = function(newMaxValue) {
    var oldValue;
    newMaxValue = this.parseFunction(newMaxValue);
    if (isNaN(newMaxValue)) {
      return;
    }
    oldValue = this._getValue();
    if (newMaxValue < this.data.minValue) {
      throw new Error("ERROR :: RangeSliderField class :: max value can't be lower then min value");
    }
    this.data.maxValue = newMaxValue;
    this.ui.$rangeInput.inputmask('option', {
      max: this.data.maxValue
    });
    this.$rangeSliderInstance.update({
      max: this.data.maxValue
    });
    this._triggerOnMaxChange();
    if (oldValue !== this._getValue()) {
      return this._onChange();
    }
  };

  RangeSliderField.prototype.isDirty = function() {
    return this.ui.$rangeBlock.classHasModifier('range', 'dirty');
  };

  RangeSliderField.prototype.on = function(eventName, callback) {
    return this.callbacks[eventName] = callback;
  };

  RangeSliderField.prototype.off = function(eventName) {
    return delete this.callbacks[eventName];
  };

  return RangeSliderField;

})();

$(".range:not('.range--with-icons')").each(function(index, element) {
  var type;
  type = $(element).find('.range__slider').data('mask-type');
  return new RangeSliderField({
    DOMElement: element,
    type: type
  });
});
