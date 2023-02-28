import React, { useState, useEffect, useRef, useCallback, Suspense, useImperativeHandle, forwardRef } from 'react';
import PopConfirm from '@beisen-phoenix/popconfirm';
import Commentor from '@beisen-phoenix/commentor/lib/index';
import Checkbox from '@beisen-phoenix/checkbox';
import utils from '@beisen-phoenix/common-utils';
import {reportAction} from '@recruit-paas/recruit-utils'
import dayjs from 'dayjs';
import RemindTimer from './remind-timer';
import { searchPromiseUrl, contactPromiseUrl } from '../constant';
import CommentContext, { IComment, IRef } from './../interface';
import locale from './../locale';
// import EmptyImg from './../icon/empty.svg';
import {
  fetchCommentsService
  , deleteService
  , deleteRemindTime
  , elikUserListService //elink页面选人组件常用和搜索接口
  , applicantUserListService
  , applicantSearchUserService
  , createCommentService
  , elinkTalentUserListService // 人才详情elink页面选人组件常用接口
  , reportUdcData //打点信息
  , createBatchCommentService // 批量添加备注
  , formateFormMetaData // 格式化formView数据
  , getCommonUsedData  // 获取常用联系人
  , getFormViewData
} from './utils';
import './index.scss';

const Loading = React.lazy(() => import(/*webpackChunkName:"loading"*/'@beisen-phoenix/loading/lib/chrysanthemum'))
const EmptyV = React.lazy(() => import(/*webpackChunkName:"hemed-empty"*/'@beisen-phoenix/themed-empty'))
const FormEmpty = React.lazy(() => import(/*webpackChunkName:"Form"*/'@beisen-phoenix/themed-empty/lib/icons/Form'))
const RecruitReply = React.lazy(() => import(/*webpackChunkName:"reply"*/'./../reply'))
const ReplyPerson = React.lazy(() => import(/*webpackChunkName:"reply-person"*/'./reply-person'))

const classes = utils.BEMClassPrefix({
  name: 'comment',
  prefix: 'recruit-paas-'
});
const ReplyComment: React.ForwardRefExoticComponent<IComment & IRef> = forwardRef((props, ref) => {
  // location 不仅用于打点信息区分，某些接口做出相应改变，也用此进行了区分
  const { Urls, isElink, applicantId, applyId, onSaveError, lang = 'zh_CN', commentId, isHideCommit = false, triggerCommentDeleted, onSaveSuccess, location, onSuccess, isShowTitle = true, isShowList = true, applicants, isShowMentionBtn = true, isShowReminderBtn = false, remarkRemindAllUser = false, actionType, actionTitle, pageTypeApproval } = props;
  const {
    getApplicantComment, //所有备注
    deleteComment, //删除备注
    createComment, //创建备注
    getRemindUserList, //获取@用户列表
    getSearchUserUrl, //应聘者详情页面搜索接口
    getHoverTips, //鼠标悬浮获姓名和邮箱接口
    createBatchComment // 批量创建备注
  } = Urls;
  const listContainerRef = useRef<HTMLDivElement>(null)
  const defaultCommentId = '00000000-0000-0000-0000-000000000000'//输入框中的文字
  const [value, setValue] = useState('');
  const [replyUser, setReplyUser] = useState(''); //储存被回复人的信息
  const [replyCommentId, setReplyCommentId] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);//设为私密
  const [isBtnLoading, setBtnLoading] = useState(false);//按钮是否是 loading 状态
  const [textareaRef, setTextareaRef] = useState<any>();//输入框
  const [scrollLine, setScrollLine] = useState(false);
  const [time, setTime] = useState(''); //设置的时间
  const [timeError, setTimeError] = useState(false) //提醒时间校验报错
  const bellLayerContainer: React.RefObject<HTMLDivElement> = useRef(null);
  const [systemContainsUser, setSystemContainsUser] = useState(false);

  const [formMetaData, setFormMetaData] = useState()

  //获取备注列表
  const fetchComments = async (applicantId) => {
    if (!applicantId || !isShowList) return
    setLoading(true);//loading的标识
    // pageType: 是否来自于审批详情页，审批详情页使用该组件只能查看，不能删除、回复、新增备注
    const resp = await fetchCommentsService(getApplicantComment, applicantId, commentId, lang, pageTypeApproval)
    setLoading(false);//loading结束
    if (resp && resp.Code === 200) {
      setComments(resp.Data);
      //保存或者删除备注之后刷新筛选简历 和 申请详情elink 多人页面的备注数量
      typeof onSaveSuccess === 'function' && onSaveSuccess(resp);
    } else if (resp && resp.Code === 403) {
      // 备注已删除
      typeof triggerCommentDeleted === 'function' && triggerCommentDeleted()
    }
  };

  useEffect(() => {
    fetchComments(applicantId);
  }, [applicantId]);

  useEffect(() => {
    getFormViewData().then(resp => {
      setFormMetaData(resp)
      // 功能按钮性能上报-end
      reportAction(actionType, actionTitle, 'end')
    })
  },[])
  useImperativeHandle(ref, ()=>{
    return {
      refresh: () => {
        fetchComments(applicantId);
      }
  }})
  //删除备注
  const handleConfirm = async (commentId) => {
    const resp = await deleteService(commentId, deleteComment, applicantId, lang)
    if (resp && resp.Code === 200) {
      //后端同学希望1s之后在请求备注列表接口，刷新存在延迟
      setTimeout(() => { fetchComments(applicantId); }, 300);
      typeof onSuccess === 'function' && onSuccess(resp, 'deleteComment');
    } else if (resp && resp.Code === 403) {
      typeof onSaveError === 'function' && onSaveError(resp, 'deleteComment');
    }
  }
  //删除提醒时间
  const handleDeleteRemindTime = async (commentId) => {
    const resp = await deleteRemindTime(commentId, lang)
    if (resp && resp.Code === 200) {
      setTimeout(() => { fetchComments(applicantId); }, 300);
      typeof onSuccess === 'function' && onSuccess(resp, 'deleteRemindTime');
    }
  }
  //保存备注
  const handleSureBtnClick = async (val) => {
    // 功能按钮性能上报-start
    reportAction(actionType, actionTitle, 'start')
    reportUdcData('report', 'Remark-Save', {}, location)
    // 校验选择时间是否大于当前时间的13分钟
    const isAfterToday = dayjs(time).isAfter(dayjs())
    const diffTime = isAfterToday && dayjs(time).diff(dayjs(), 'minute')
    if (time && (!isAfterToday || diffTime <= 13)) {
      setTimeError(true)
      return false;
    }
    setBtnLoading(true) //点击保存备注的确定按钮的loading效果
    if (applicants && applicants.length > 1) { // 批量添加备注
      let applicantsIds = applicants.map(value => ({ ApplicantId: value.ApplicantId, ApplyId: value.ApplyId }))
      const resp = await createBatchCommentService(createBatchComment, applicantsIds, val, isPrivate, props.baseParams, lang)
      if (resp && resp.Code === 200) {
        typeof props.onClose === 'function' && props.onClose({ type: resp.TipType.toLowerCase(), message: resp.Message, description: resp.MoreMessage });
        return
      }
      typeof props.onClose === 'function' && props.onClose({ type: 'error', message: resp.Message, description: resp.MoreMessage });
      return
    }
    const resp = await createCommentService(createComment, time, applicantId, applyId, replyCommentId, isPrivate, val,location, lang)
    setBtnLoading(false) //确定按钮的loading结束
     // 功能按钮性能上报-end
     reportAction(actionType, actionTitle, 'end')
    if (resp && resp.Code === 200) {
      //添加备注成功
      setTime('') //提醒时间
      setValue(''); //情况备注的文本框
      setReplyUser(''); //情况备注框上的被回复人信息
      setReplyCommentId(defaultCommentId);
      setIsPrivate(false); //清空私密状态
      //后端同学希望延迟1s请求接口，列表刷新存在延迟
      setTimeout(() => {
        fetchComments(applicantId);
      }, 300);
      typeof onSuccess === 'function' && onSuccess(resp, 'createComment');
      typeof props.onModify === 'function' && props.onModify(false);
    } else if (resp && resp.Code === 403) {
      //添加备注失败  应聘者有可能被拉黑
      typeof onSaveError === 'function' && onSaveError(resp, 'createComment');
      typeof props.onClose === 'function' && props.onClose({ type: 'error', message: resp.Message, showCloseButton: false });
    }
  };

  const hanlePrivate = (data) => {
    reportUdcData('change', 'Remark-PrivateBtn', {}, location)
    const privateStatus = data.checked;
    setIsPrivate(privateStatus);
  };
  const getTextRef = (ref) => {
    setTextareaRef(ref)
  }
  const handleSelectTime = useCallback((time) => {
    setTime(time)
    setTimeError(false)
  }, [])
  const handleDeleteTime = useCallback(() => {
    setTime('')
    setTimeError(false)
  }, [])
  //(PC端申请详情和人才详情）-添加和查看功能、(PC端和移动端的人才详情elink、申请详情elink）-查看功能
  const hasReminderBtn = ((location === 'applyDetail' || location === 'talentDetail') && !isElink) || isShowReminderBtn
  const getBtnExternal = () => {
    let btnExternal = [
      <Checkbox
        key={String(isPrivate)}
        extraCls="private-checkbox1"
        value={'1'}
        label={locale[lang].pravite}
        defaultChecked={isPrivate}
        onChange={hanlePrivate}
      />
    ]
    if (hasReminderBtn) {
      btnExternal.unshift(<RemindTimer
        key={'reminder'}
        lang={lang}
        onSelect={handleSelectTime}
        onDelete={handleDeleteTime}
        time={time}
        timeError={timeError}
        bellLayerContainer={bellLayerContainer}
      />)
    }
    return btnExternal
  }
  
  const GetSystemContainsUser = (data) => {
    setSystemContainsUser(data)
  }

  const commentProps = {
    lang: lang,
    apiPath: '', //主站host
    tenantId: '', //租户id
    userId: '', //用户id
    uploadBtnOption: {
      // label: '',
      files: [],
    },
    isShowMentionBtn,
    isShowUploadBtn: false,
    isShowMentionAllBtn: false,
    isShowEmojyBtn: false,
    isShowVisible: false,
    noDataText: systemContainsUser ? locale[lang].systemContainsUser : locale[lang].no_data,
    sureCancelBtnOption: {
      sureBtnText: locale[lang].sure, //确定按钮文本 ff
      sureBtnLoading: isBtnLoading, //确定按钮是否处于loading状态
      onSureBtnClick: handleSureBtnClick, //确定按钮点击事件
      cancelBtnText: '', //取消按钮文本
      isShowCancelBtn: false, //是否显示取消按钮
      onCancelBtnClick: (e) => { }, //取消按钮点击事件
    },
    textAreaOption: {
      value: value,
      placeholder: isShowMentionBtn ? locale[lang].enterDescription : locale[lang].enterMoreDescription,
      maxLength: 1000,
      autoHeight: true,
      getTextRef: getTextRef,
      onTextChange: (val) => {
        setValue(val)
        typeof props.onChange === 'function' && props.onChange(val);
        typeof props.onModify === 'function' && props.onModify(!!val);
      }
    },
    operationBtnExternal: getBtnExternal(),

    contactPromise: () => {
      reportUdcData('report', 'Remark-MentionBtn', {}, location)
      if(remarkRemindAllUser) {
        return getCommonUsedData(contactPromiseUrl);
      } else {
        if(location === 'talentDetailElink' || location === 'talentDetailBlackElink') {
          return elinkTalentUserListService(getRemindUserList,applicantId,'', lang, )
        }else if (isElink && location === 'applyDetail') {
          //Elink页面使用的获取渲染组件的接口
          return elikUserListService(getRemindUserList, applicantId, applyId, '', lang);
        } else {
          //应聘者详情页面使用的获取选人组件的接口
          return applicantUserListService(getRemindUserList, lang);
        }
      }
    },
    searchPromise: (searchStr) => {
      if(remarkRemindAllUser) {
        return applicantSearchUserService(searchPromiseUrl, searchStr, lang, true)
      } else {
        if(location === 'talentDetailElink' || location === 'talentDetailBlackElink') {
          return elinkTalentUserListService(getRemindUserList,applicantId,searchStr, lang, GetSystemContainsUser, true)
        }else if (isElink && location === 'applyDetail') {
          return elikUserListService(getRemindUserList, applicantId, applyId, searchStr,lang, GetSystemContainsUser, true)
        } else {
          return applicantSearchUserService(getSearchUserUrl, searchStr, lang, true)
        }
      }
    },
    dataProvideByExternalPromise: true, //选人组件使用外部数据
    // @ts-ignore
    userShowDepartment: formateFormMetaData(formMetaData).CallUserIds?.isShowDepartmentName,
  };
  const handleReplyDelete = (target, commentId, popContainerRef) => {
    PopConfirm.show({
      message: locale[lang].toDelete,
      target: target,
      confirmText: locale[lang].yes,
      cancelText: locale[lang].no,
      getPopupContainer: () => {
        return listContainerRef ? listContainerRef.current : document.body
      },
      // placement: 'bottom',
      extraCls: 'recruit-pass-delete-comment',
      onConfirm: () => {
        handleConfirm(commentId);
      },
      onCancel: () => { },
    });
  }
  const handleReply = (commentId, publishUser, isPrivate) => {
    //备注框上面的回复人
    setReplyUser(publishUser.Name);
    //被回复人的commentId
    setReplyCommentId(commentId);
    // alert('点击了回复');
    setIsPrivate(isPrivate);
    textareaRef && typeof textareaRef.focus === 'function' && textareaRef.focus()
  }
  //关闭回复
  const handleCloseReply = () => {
    setReplyUser('');
    setIsPrivate(false);
    setReplyCommentId(defaultCommentId)
  };
  const handleScroll = () => {
    if (listContainerRef && listContainerRef.current && listContainerRef.current.scrollTop > 0) {
      setScrollLine(true)
    } else {
      setScrollLine(false)
    }
  }
  const throttle = (func, delay) => {
    let timer;
    let startTime = Date.now();
    return function () {
      let curTime = Date.now();
      let remaining = delay - (curTime - startTime);
      clearTimeout(timer);
      if (remaining < 0) {
        func.apply(null);
        startTime = Date.now();
      } else {
        timer = setTimeout(func, remaining);
      }
    }
  }

  const outerCls = () => {
    if (time && timeError) {
      return classes({ element: 'hasTimeError' })
    }
    if (time) {
      return classes({ element: 'hasTime' })
    }
    return ''
  }
  const contextValue = {
    onDeleteRemindTime: handleDeleteRemindTime
  }
  return (
      <CommentContext.Provider value={contextValue}>
        <div className={isElink ? `${classes({ element: 'wrapper' })} ${classes({ element: 'wrapper-flex' })}` : `${classes({ element: 'wrapper' })} ${outerCls()}`}>
          <div className={scrollLine ? `${classes({ element: 'header' })} ${classes({ element: 'scroll-line' })}` : classes({ element: 'header' })}>
            {isShowTitle && <div className={classes({ element: 'label' })}> {locale[lang].commentTitle}</div>}
            {replyUser && <Suspense fallback={null}><ReplyPerson replyUser={replyUser} onClose={handleCloseReply} lang={lang} /></Suspense>}
            { !isHideCommit && <div ref={bellLayerContainer} className={classes({ element: hasReminderBtn ? 'hasReminderBtn' : 'noReminderBtn' })}><Commentor {...commentProps} /></div>}
          </div>
          {isShowList && <div
            onScroll={throttle(handleScroll, 300)}
            ref={listContainerRef}
            className={isElink ? classes({ element: 'flex' }) : classes({ element: 'list' })}>
            <React.Suspense fallback={null}>
              {isElink && loading
                ? <Loading />
                : (isElink && comments.length === 0
                  ? <div className={classes({ element: 'empty' })}><EmptyV description={locale[lang].noComment} image={<FormEmpty openChangeSkin={true}/>} /></div>
                  : <RecruitReply
                    lang={lang}
                    isElink={isElink}
                    location={location}
                    getHoverTips={getHoverTips}
                    comments={comments}
                    total={comments.length}
                    commentLimit={5}
                    isShowReply={!isHideCommit}
                    isShowReminderBtn={isShowReminderBtn}
                    onReplyDelete={handleReplyDelete}
                    onReply={handleReply} />)}
            </React.Suspense>
  
          </div>}
        </div >
      </CommentContext.Provider>
  );
});

export { RemindTimer }
export default ReplyComment;
//trigger ci20221031