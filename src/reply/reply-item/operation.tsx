import React, { FC } from 'react';
import { TextButton } from '@beisen-phoenix/button';
import utils from '@beisen-phoenix/common-utils';

import { IOperation } from './../../interface';
import locale from './../../locale';

import {
  reportUdcData //打点信息
} from './../../reply-comment/utils';

const classes = utils.BEMClassPrefix({
  name: 'reply-operate',
  prefix: 'recruit-paas-'
});
const Operation: FC<IOperation> = (props) => {
  const {
    onOperationClick
    , commentId
    , publishUser
    , isPrivate
    , lang = 'zh_CN'
    , isEdit //是否可以删除 是否显示删除按钮
    , location // 打点信息的显示
    , isShowReply
  } = props;
  const handleOperationClick = (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    onOperationClick(e.target, commentId, publishUser, isPrivate);
    if (e.target.innerText === locale[lang].delete) {
      reportUdcData('click', 'Remark-Delete', e, location)
    } else {
        reportUdcData('click', 'Remark-Reply', e, location)

    }
  };
  return (
    <ul className={classes({ element: 'wrapper' })}>
      {isEdit &&
        <li className={classes({ element: 'item' })} onClick={handleOperationClick} data-id={commentId}>
          <TextButton size="small" text={locale[lang].delete} />
        </li>
      }
      {isShowReply && (
        <li className={classes({ element: 'item' })} onClick={handleOperationClick} idata-id={commentId}>
          <TextButton size="small" text={locale[lang].reply} />
        </li>
      )} 
    </ul>
  );
};
export default Operation;
