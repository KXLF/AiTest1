import React, { FC, useRef, useState } from 'react';
import More1 from '@beisen-phoenix/icon/lib/more1';
import Avatar, { Size } from '@beisen-phoenix/avatar';
import Tooltip from '@beisen-phoenix/easy-tooltip';
import utils from '@beisen-phoenix/common-utils';
import { $CSS_VAR_M5, $CSS_VAR_S2 } from '@beisen-phoenix/style-token/lib';

import { IReplyItem } from './../../interface';
import locale from './../../locale';
import ReplyItemMain from './reply-item-main';
import Operation from './operation';
import './index.scss';



const classes = utils.BEMClassPrefix({
  name: 'reply-item',
  prefix: 'recruit-paas-'
});

const ReplyItem: FC<IReplyItem> = (props) => {
  const { comment, onOperationClick, lang = 'zh_CN', isElink, getHoverTips,location, isShowReply, isShowReminderBtn } = props;
  const popContainerRef = useRef<HTMLDivElement>(null)
  const {
    PublishUser, //创建备注的人
    JobName, //职位名称
    StatusName,
    PhaseName, //阶段状态
    CommentId, // 备注id
    IsPrivate, //是否为私密zhuangt
    IsEdit, //是否可以删除
  } = comment;
  const {
    UserAvatar, //头像相关信息
    Name, //创建备注人的名字
    Id, //创建备注人的Id
  } = PublishUser;

  const avatarProps = {
    size: Size.xxsm,
    children: Name,
    src: UserAvatar.Small,
    bgColor: UserAvatar.Color,
    userId: Id,
    extraCls: 'reply-item-avatar'
  }
  const handleOperationClick = (target, commentId, PublishUser, IsPrivate) => {
    typeof onOperationClick === 'function' && onOperationClick(target, commentId, PublishUser, IsPrivate, popContainerRef)
  }
  const [color, setColor] = useState($CSS_VAR_M5);
  const handleMouseEnter = () => {
    setColor($CSS_VAR_S2);
  };
  const handleMouseLeave = () => {
    setColor($CSS_VAR_M5);
  };
  return (
    <div className={classes({ element: 'wrapper' })} ref={popContainerRef} >
      <Avatar {...avatarProps} />
      <ReplyItemMain
        lang={lang}
        comment={comment}
        isElink={isElink}
        getHoverTips={getHoverTips}
        location={location}
        isShowReminderBtn={isShowReminderBtn}
        />
      <div className={classes({ element: 'operation' })} >
        <Operation
          onOperationClick={handleOperationClick}
          commentId={CommentId}
          publishUser={PublishUser}
          isPrivate={IsPrivate}
          lang={lang}
          isEdit={IsEdit}
          location = {location}
          isShowReply={isShowReply}
        />
      </div>
      {
        (JobName && PhaseName) && (
        <Tooltip
          title={StatusName
            ? `<div>${locale[lang].jobName}: ${JobName}</div> <div> ${locale[lang].status}: ${PhaseName}(${StatusName})</div>`
            : `<div>${locale[lang].jobName}: ${JobName}</div> <div> ${locale[lang].status}: ${PhaseName}</div>`}
          isHTMLContent={true}
        >
          <span className={classes({ element: 'more' })} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} >
            <More1 color={color} width={'14px'} height={'14px'} />
          </span>
        </Tooltip>
        )
      }
      
    </div >
  );
};

export default ReplyItem;
