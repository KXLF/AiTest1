import React, { FC, useState, useContext, memo } from 'react';
import Tooltip from '@beisen-phoenix/tooltip';
import utils from '@beisen-phoenix/common-utils';
import Message from '@beisen-phoenix/message';
import BSFetch from '@beisen/fetch';
import Delete from '@beisen-phoenix/icon/lib/close';
import Bell from '../../icon/bell';
import dayjs from 'dayjs';
import { formatTime } from '../../reply-comment/utils';

import Lock from '../../icon/lock.svg';
import CommentContext, { IReplyItemMain } from './../../interface';
import locale from './../../locale';

const classes = utils.BEMClassPrefix({
  name: 'reply-main',
  prefix: 'recruit-paas-'
});
const ReplyItemMain: FC<IReplyItemMain> = (props) => {
  const commentContext = useContext(CommentContext)
  const { comment, getHoverTips, lang = 'zh_CN', isElink, location, isShowReminderBtn = false } = props;
  const {
    PublishUser, // 备注创建者信息
    IsReply, // 是否回复
    ParentUser, //被回复者信息
    CreateDate, //备注的创建日期
    IsPrivate, // 是否为私密备注
    CommentData,
    RemindTime,
    HasViewRemindTimePermission, // 是否有查看提醒权限
    IsEdit,
    CommentId
  } = comment;
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState(1);
  const { Name } = PublishUser;
  const toolTipData = {
    title: name ? `${name}(${status === 1 ? email : '已停用'})` : '' ,
    mouseEnterDelay: 0.1,
    mouseLeaveDelay: 0
  };
  const handleMouseEvent = (e) => {
    const type = e.type; //获取是鼠标移入还是移除
    if (type === 'mouseenter') {
      BSFetch.get(getHoverTips, {
        params: {
          id: parseInt(e.target.getAttribute('data-userid')),
        }
      }).then(resp => {
        if (resp.Code === 200) {
          setName(resp.Data && resp.Data.Name);
          setEmail(resp.Data && resp.Data.Email);
          setStatus(resp.Data && resp.Data.UserStatus);
        }
      }).catch((error) => {
        Message.error({
          message: error.error ? error.error.message : error.statusText
        });
        return null;
      })
    } else {
      setName('');
      setEmail('');
    }
  };
  const handleDelete = () => {
    commentContext.onDeleteRemindTime(CommentId)
  }
  const isExpire = dayjs(RemindTime).isBefore(dayjs())
  // （PC端申请详情和人才详情）-添加和查看功能、(PC端和移动端的人才详情elink、申请详情elink）-查看功能
  const hasPagePermission = (location === 'applyDetail' || location === 'talentDetail' || location === 'talentDetailElink') || isShowReminderBtn
  const canViewRemindTime = hasPagePermission && HasViewRemindTimePermission && RemindTime
  return (
    <div className={classes({ element: 'wrapper' })}>
      <div className={classes({ element: 'header' })}>
        <span className={classes({ element: 'oparator' })}>{Name}</span>
        {IsReply && (
          <span>
            <span className={classes({ element: 'type' })}>{locale[lang].reply}</span>
            <span className={classes({ element: 'person' })}>{ParentUser.Name}</span>
          </span>
        )}
        <span>：</span>
        {CommentData.map((item, index) => {
          if (item.UserId !== 0) {
            return (
              <span key={index}>
                {isElink ?
                  <a className={classes({ element: 'user-name' })} data-userid={item.UserId}>
                    {'@' + item.UserName}
                  </a> :
                  <Tooltip {...toolTipData}>
                    <a className={classes({ element: 'user-name' })} data-userid={item.UserId} onMouseEnter={handleMouseEvent} onMouseLeave={handleMouseEvent}>
                      {'@' + item.UserName}
                    </a>
                  </Tooltip>
                }
                <pre className={classes({ element: 'content' })}>{item.Content}</pre>
              </span>
            );
          } else {
          return <pre key={index} className={classes({ element: 'content' })}>{item.Content}</pre>;
          }
        })}
      </div>
      {canViewRemindTime && <div className={classes({ element: isExpire ? 'remind_expireTime' : 'remind_time'})}>
        <Bell width={12} height={12} color={'currentColor'}  className={classes({ element: isExpire ? 'remind_expireBell' : 'remind_bell' })}/>
        {formatTime(RemindTime)}
        {!isElink && IsEdit && !isExpire && <Delete width={10} height={10} color={'#FFA42E'} className={classes({ element: 'remind_delete' })} onClick={handleDelete}/>}
      </div>}
      <p className={classes({ element: 'bottom' })} >
        <span className={classes({ element: 'date' })}>{CreateDate}</span>
        {IsPrivate && <img className={classes({ element: 'private' })} src={Lock} />}
      </p>
      <div className={classes({ element: 'line' })}></div>
    </div>
  );
};
export default memo(ReplyItemMain);
