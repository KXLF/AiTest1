import React, { FC, useState } from 'react';
import TextButton from '@beisen-phoenix/button/lib/text-button';
import DoubleDown from '@beisen-phoenix/icon/lib/double-down';

import { IReply } from './../interface';
import ReplyList from './reply-list';
import locale from './../locale';
import './index.scss';


const Reply: FC<IReply> = (props) => {
  const [showAll, setShowAll] = useState(true);
  //查看更多的下箭头图标
  const doubleDown = <DoubleDown color="currentColor" width={'14px'} height={'14px'} />;
  const {
    comments, //备注的list数据
    total, //备注的总数量
    commentLimit, //允许显示的备注数量
    lang,
    isElink,
    location,
    getHoverTips,
    isShowReply,
    onReplyDelete,
    onReply,
    isShowReminderBtn
  } = props;
  const commentList = showAll ? comments.slice(0, commentLimit) : comments;

  const btnText = `${locale[lang || 'zh_CN'].showMore}(${total - commentLimit > 999 ? '999+' : total - commentLimit})`;
  const showAllReply = () => {
    setShowAll(false);
  };
  return (
    <div className="recruit-pass-reply">
      {<ReplyList
        comments={commentList}
        lang={lang}
        isElink={isElink}
        location={location}
        isShowReply={isShowReply}
        onReplyDelete={onReplyDelete}
        onReply={onReply}
        getHoverTips={getHoverTips}
        isShowReminderBtn={isShowReminderBtn}
      />}
      {showAll && total > commentLimit && (
        <div className="recruit-pass-show-more" onClick={showAllReply}>
          <TextButton text={btnText} size="small" suffixIcon={doubleDown} type="secondary" />
        </div>
      )}
    </div>
  );
};

export default Reply;
