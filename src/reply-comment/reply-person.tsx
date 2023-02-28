import React, { FC, useState } from 'react';
import Circle from '@beisen-phoenix/icon/lib/circle';
import { $M5, $red } from '@beisen-phoenix/style-token';

import { IReplyPerson } from './../interface';
import locale from './../locale';

const ReplyPerson: FC<IReplyPerson> = (props) => {
  const { replyUser, onClose, lang } = props;
  const [color, setColor] = useState($M5);
  const handleMouseEnter = () => {
    setColor($red);
  };
  const handleMouseLeave = () => {
    setColor($M5);
  };
  return (
    <div className="recruit-paas-reply-comment">
      <span className="recruit-paas-reply-text">{locale[lang || 'zh_CN'].reply}</span>
      <span className="recruit-paas-reply-name" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={onClose}>
        {replyUser}
        <Circle color={color} width={'12px'} height={'12px'} />
      </span>
    </div>
  );
};
export default ReplyPerson;
