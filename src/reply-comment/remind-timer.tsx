import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Tooltip from '@beisen-phoenix/easy-tooltip';
import Delete from '@beisen-phoenix/icon/lib/close';
import Bell from '../icon/bell';
import utils from '@beisen-phoenix/common-utils';
import dayjs from 'dayjs';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { DefaultTimer, formatDefaultTimer, formatTime } from './utils';
import { getTimeLocale } from "@recruit-paas/recruit-utils"
import locale from '../locale';
import { IRemindTimerProps } from '../interface';
import './index.scss';

// moment.locale('zh-cn');
// 配合构建工具，用dayjs替换moment
import 'dayjs/locale/zh-cn';


const UnmodeledLayer = React.lazy(() => import(/*webpackChunkName:"nmodeled-layer"*/'@beisen-phoenix/unmodeled-layer'))
const DateTimePicker = React.lazy(() => import(/*webpackChunkName:"date-time-picker"*/'@beisen-phoenix/date-time-picker'));
const SelectList = React.lazy(() => import(/*webpackChunkName:"select-list"*/'@beisen-phoenix/select-list'));

const classes = utils.BEMClassPrefix({
  name: 'comment',
  prefix: 'recruit-paas-',
});

const RemindTimer: React.FC<IRemindTimerProps> = (props) => {
  const { lang = 'zh_CN', onSelect, onDelete, time, timeError, bellLayerContainer } = props;
  const [timeValue, setTimeValue] = useState<moment.Moment | string>(() => {
    return moment()
      .add(1, 'day')
      .set('hour', 9)
      .set('minute', 0);
  });
  const [dateValue, setDateValue] = useState(timeValue);
  const [visible, setVisible] = useState(false); //弹层是否显示
  const [showCustomTimer, setShowCustomTimer] = useState(false); //日期时间弹层(自定义时间按钮)
  const showDataTimePicker = time || showCustomTimer;

  dayjs.locale(getTimeLocale(lang))

  useEffect(() => {
    const updateValue = () => {
      if (time) {
        return moment(time);
      }
      return moment()
        .add(1, 'day')
        .set('hour', 9)
        .set('minute', 0);
    };
    setTimeValue(updateValue());
    setDateValue(updateValue());
  }, [time]);
  const handleVisibleChange = (visible) => {
    setVisible(visible);
    //日期时间弹层打开，但未选择时间
    if (!visible) {
      setShowCustomTimer(false);
    }
  };
  const handleCustomTime = () => {
    handleVisibleChange(true);
    setShowCustomTimer(true);
    const value = moment()
      .add(1, 'day')
      .set('hour', 9)
      .set('minute', 0);
    setTimeValue(value);
    setDateValue(value);
  };
  const handleTime = () => {
    handleVisibleChange(true);
    setShowCustomTimer(true);
  };
  const handleSelect = (option) => {
    const formatTime = formatDefaultTimer(option);
    onSelect(formatTime);
    handleVisibleChange(false);
  };
  const disabledDate = useCallback((current) => {
    return (
      current &&
      current <
      moment()
        .subtract(1, 'day')
        .endOf('day')
    );
  }, []);
  const disabledHours = useCallback(() => {
    const currentHour = moment().hour();
    const currentminute = moment().minute();
    let hours: number[] = [];
    for (let i = 0; i < 24; i++) {
      if (moment().isSame(dateValue, 'day') && (i < currentHour || (i === currentHour && 60 - currentminute < 15))) {
        hours.push(i);
      }
    }
    return hours;
  }, [dateValue]);
  const disabledMinutes = useCallback(
    (selectedHour) => {
      const currentminute = moment().minute();
      const currentHour = moment().hour();
      let minutes: number[] = [];
      for (let i = 0; i <= 45; i += 15) {
        // 当前hour时，不能选中的minute
        const currentHourDisabledMinutes = currentHour === selectedHour && (i < currentminute || i - currentminute < 15);
        // 小于当前hour时，不能选中的minute(此场景出现在选中今天之后的时间后，又切回今天，但填充的hour已经是今天的过去时了)
        const pastHourDisabledMinutes = currentHour > selectedHour;
        if (moment().isSame(dateValue, 'day') && (currentHourDisabledMinutes || pastHourDisabledMinutes)) {
          minutes.push(i);
        }
      }
      return minutes;
    },
    [dateValue]
  );
  const handleOk = useCallback((value) => {
    const formatTime = moment(value).format('YYYY/MM/DD HH:mm');
    onSelect(formatTime);
    handleVisibleChange(false);
  }, []);
  const handleDateSelect = useCallback((value) => {
    setDateValue(moment(value));
  }, []);
  const handleTimeChange = useCallback((value) => {
    if (value) {
      setTimeValue(moment(value));
    }
  }, []);
  const handleClear = useCallback(() => {
    setTimeValue('');
    setDateValue('');
  }, []);
  const handleDelete = () => {
    onDelete();
  };
  const content = () => {
    if (showDataTimePicker) {
      const datePickerProps = {
        value: dateValue,
        onSelect: handleDateSelect,
        disabledDate: disabledDate,
        showToday: false,
        format: 'YYYY-MM-DD'
      };
      const timePickerProps = {
        value: timeValue,
        onChange: handleTimeChange,
        disabledHours: disabledHours,
        disabledMinutes: disabledMinutes
      };
      return (
          <DateTimePicker
            datePickerProps={datePickerProps}
            timePickerProps={timePickerProps}
            onOk={handleOk}
            onClear={handleClear}
            showSecond={false}
            minuteStep={15}
          ></DateTimePicker>
      );
    }
    return (
      <>
          <SelectList options={DefaultTimer} onSelect={handleSelect} />
          <span className={classes({ element: 'remind_customBtn' })} onClick={handleCustomTime}>
            {locale[lang].customTime}
          </span>
      </>
    );
  };
  return (
    <div>
      {time && (
        <div className={classes({ element: 'remind_time' })}>
          <Bell width={12} height={12} color={'currentColor'} className={classes({ element: 'bell' })} />
          <span onClick={handleTime}>{formatTime(time)}</span>
          <Delete width={10} height={10} color={'#FFA42E'} className={classes({ element: 'remind_delete' })} onClick={handleDelete} />
        </div>
      )}
      {timeError && <div className={classes({ element: 'remind_timeError' })}>{locale[lang].remindErrorText}</div>}
      <Tooltip title={locale[lang].remindToolTip}>
        <div className={classes({ element: 'remind_timeWrap' })}>
          <span className={visible ? `${classes({ element: 'bell_wrap' })} ${classes({ element: 'showLayer' })}` : classes({ element: 'bell_wrap' })} onClick={handleVisibleChange}>
            <Bell
              width={14}
              height={14}
              color={'currentColor'}
              className={visible ? `${classes({ element: 'bell_btn' })} ${classes({ element: 'showLayer' })}` : classes({ element: 'bell_btn' })}
            />
            <span className={classes({ element: 'remind_btn' })}>{locale[lang].remindBtn}</span>
          </span>
        </div>
      </Tooltip>
      {
        visible &&
        <Suspense fallback={null}>
          <UnmodeledLayer
            extraCls={showDataTimePicker ? classes({ element: 'remind_customLayer' }) : classes({ element: 'remind_defaultLayer' })}
            visible={visible}
            size={'auto'}
            footer={null}
            trigger={['click']}
            content={content()}
            onVisibleChange={handleVisibleChange}
            destroyPopupOnHide
            getPopupContainer={()=> bellLayerContainer ? bellLayerContainer.current : document.body}
          >
          </UnmodeledLayer>
        </Suspense>
      }
    </div>
  );
};
export default RemindTimer;
