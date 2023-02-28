import React, { FC } from 'react';

import ReplyItem from '../reply-item';
import { IReplyList } from './../../interface';
import locale from './../../locale';

const ReplyList: FC<IReplyList> = (props) => {
  //备注列表
  const { comments, onReplyDelete, onReply, getHoverTips, lang = 'zh_CN', isElink,location, isShowReply, isShowReminderBtn } = props;
  const handelOperationClick = (target, commentId, PublishUser, IsPrivate, popContainerRef) => {
    const targetName = target.innerText;
    //删除
    if (targetName === locale[lang].delete) {
      onReplyDelete(target, commentId, popContainerRef);
    } else {
      // 回复
      onReply(commentId, PublishUser, IsPrivate);
    }
  };
  return (
    <div className="recruit-paas-reply-list">
      {comments.map((item) => {
        return (
          <li key={item.CommentId}>
            <ReplyItem
              lang={lang}
              isElink={isElink}
              location={location}
              getHoverTips={getHoverTips}
              comment={item}
              isShowReply={isShowReply}
              onOperationClick={handelOperationClick}
              isShowReminderBtn={isShowReminderBtn}
            />
          </li>
        );
      })}
    </div>
  );
};

export default ReplyList;
