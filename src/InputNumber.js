'use strict';

var React = require('react');
var rcUtil = require('rc-util');

function noop() {
}

function isValueNumber(value) {
  return (/^-?\d+?$/).test(value + '');
}

var InputNumber = React.createClass({
  getInitialState() {
    var value;
    var props = this.props;
    if ('value' in props) {
      value = props.value;
    } else {
      value = props.defaultValue;
    }
    return {
      value: value
    };
  },
  getDefaultProps() {
    return {
      prefixCls: 'rc-input-number',
      max: Infinity,
      min: -Infinity,
      style:{},
      onChange: noop
    };
  },
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        value: nextProps.value
      });
    }
  },
  setValue(v) {
    this.setState({
      value: v
    });
    this.props.onChange(v);
  },
  step(type, e) {
    if (e) {
      e.preventDefault();
    }
    var props = this.props;
    if (props.disabled) {
      return;
    }
    var value = this.state.value;
    if (isNaN(value)) {
      return;
    }
    var stepNum = props.step || 1;
    var val = value;
    if (type === 'down') {
      val -= stepNum;
    } else if (type === 'up') {
      val += stepNum;
    }
    if (val > props.max || val < props.min) {
      return;
    }
    this.setValue(val);
  },
  onChange(event) {
    var props = this.props;
    var val = event.target.value.trim();
    if (!val) {
      this.setValue(val);
    } else if (isValueNumber(val)) {
      val = Number(val);
      if ('min' in props) {
        if (val < props.min) {
          return;
        }
      }
      if ('max' in props) {
        if (val > props.max) {
          return;
        }
      }
      this.setValue(val);
    }
  },

  down(e) {
    this.step('down', e);
  },

  up(e) {
    this.step('up', e);
  },

  handleKeyDown(e) {
    if (e.keyCode === 38) {
      this.up(e);
    } else if (e.keyCode === 40) {
      this.down(e);
    }
  },
  render() {
    var props = this.props;
    var prefixCls = props.prefixCls;
    var classes = rcUtil.classSet({
      [prefixCls]: true,
      [`${prefixCls}-disabled`]: props.disabled
    });
    var upDisabledClass = '';
    var downDisabledClass = '';
    var value = this.state.value;
    if (isValueNumber(value)) {
      var val = Number(value);
      if (val >= props.max) {
        upDisabledClass = `${prefixCls}-handler-up-disabled`;
      }
      if (val <= props.min) {
        downDisabledClass = `${prefixCls}-handler-up-disabled`;
      }
    } else {
      upDisabledClass = `${prefixCls}-handler-up-disabled`;
      downDisabledClass = `${prefixCls}-handler-up-disabled`;
    }
    // ref for test
    return (
      <div className={classes} style={props.style}>
        <div className={`${prefixCls}-handler-wrap`}>
          <div unselectable={true}
            ref="up"
            onClick={upDisabledClass ? noop : this.up}
            className={`${prefixCls}-handler ${prefixCls}-handler-up ${upDisabledClass}`}>
            <div className={`${prefixCls}-handler-up-inner`}></div>
          </div>
          <div unselectable={true}
            ref="down"
            onClick={downDisabledClass ? noop : this.down}
            className={`${prefixCls}-handler ${prefixCls}-handler-down ${downDisabledClass}`}>
            <div className={`${prefixCls}-handler-down-inner`}></div>
          </div>
        </div>
        <div className={`${prefixCls}-input-wrap`}>
          <input className={`${prefixCls}-input`}
            autoComplete="off"
            onKeyDown={this.handleKeyDown}
            autoFocus={props.autoFocus}
            readOnly={props.readOnly}
            disabled={props.disabled}
            max={props.max}
            min={props.min}
            name={props.name}
            onChange={this.onChange}
            ref="input"
            value={this.state.value} />
        </div>
      </div>
    );
  }
});

module.exports = InputNumber;
