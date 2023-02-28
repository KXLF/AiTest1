
import BSFetch from '@beisen/fetch';
import Message from '@beisen-phoenix/message';
import dayjs from 'dayjs';
import {defaultTimeListValue} from '../interface';
import locale from './../locale';

export const fetchCommentsService = async (getApplicantComment, applicantId, commentId, lang, pageType) => {
  try {
    let params = commentId ? { applicantId, commentId, pageType } : { applicantId, pageType }
    const resp = await BSFetch.get(getApplicantComment, { params })
    return resp
  } catch (error) {
    Message.error({
      // message:
      message: locale[lang].network_error || '网络开小差，请稍后重试',
      showCloseButton: false,
    });
    return [];
  }
}

export const deleteService = async (commentId, deleteComment, applicantId, lang) => {
  try {
    const resp = await BSFetch.get(`${deleteComment}?key=${commentId}&applicantId=${applicantId}`, {
      params: {
        // key: commentId,
      }
    });
    return resp
  } catch (error) {
    Message.error({
      // message: error.error ? error.error.message : error.statusText
      message: locale[lang].network_error || '网络开小差，请稍后重试',
      showCloseButton: false,
    });
    return null;
  }
}
export const deleteRemindTime = async (commentId, lang) => {
  try {
    const resp = await BSFetch.get('/mrest/Recruitment/RecruitmentV6/100000/ApplicantComment/DeleteCommentRemindTime', {
      params: {
        commentId: commentId
      }
    })
    return resp
  } catch (error) {
    Message.error({
      // message: error.error ? error.error.message : error.statusText
      message: locale[lang].network_error || '网络开小差，请稍后重试',
      showCloseButton: false,
    });
    return null;
  }
}
export const elikUserListService = async (getRemindUserList, applicantId, applyId, searchKey, lang?: string, callback?: (data) => void, isSeaarch = false) => {
  try {
    const resp = await BSFetch.get(getRemindUserList, {
      params: {
        applicantId: applicantId,
        applyId: applyId,
        searchKey: searchKey || '',
        sceneType: 70
      },
    })
    if (resp.Code === 200) {
      callback && callback(resp.Data.SystemContainsUser)
      const data = resp.Data?.RemindStaffList || resp.Data;
      return data.map((item) => {
        return {
          Id: item.Id,
          Avatar: item.UserAvatar.Small,
          Name: item.Name,
          Email: item.Email,
          AvatarColor: item.UserAvatar.Color || '#f79c6f', // 默认颜色
          Department: item.Department,
          DepartmentId: item.DepartmentId,
          TopDepartment: item.TopDepartment,
          TopDepartmentName: item.TopDepartmentName,
          OrgFullName:  isSeaarch ? item.OrgFullName : '',
          
        };
      });
    }
  } catch (error) {
    Message.error({
      // message: error.error ? error.error.message : error.statusText
      message: lang && locale[lang].network_error || '网络开小差，请稍后重试',
      showCloseButton: false,
    });
    return []
  }

}

export const elinkTalentUserListService = async (getRemindUserList, applicantId, searchKey, lang, callback?: (data) => void, isSeaarch = false) => {
  try {
    let resp
    let data = searchKey ? { applicantId, searchKey } : { applicantId }
    resp = await BSFetch.get(getRemindUserList, {
      params: {
        ...data,
        sceneType: 70
      }
    })
    if (resp.Code === 200) {
      callback && callback(resp.Data.SystemContainsUser)
      const data = resp.Data?.RemindStaffList || [];
      return data.map((item) => {
        return {
          Id: item.Id,
          Avatar: item.UserAvatar.Small,
          Name: item.Name,
          Email: item.Email,
          AvatarColor: item.UserAvatar.Color || '#f79c6f',
          Department: item.Department,
          DepartmentId: item.DepartmentId,
          TopDepartment: item.TopDepartment,
          TopDepartmentName: item.TopDepartmentName,
          OrgFullName: isSeaarch ? item.OrgFullName : '',
        };
      });
    }
  } catch (error) {
    Message.error({
      // message: error.error ? error.error.message : error.statusText
      message: locale[lang].network_error || '网络开小差，请稍后重试',
      showCloseButton: false,
    });
    return null;
  }
}

export const applicantUserListService = async (getRemindUserList, lang?: string) => {
  try {
    const resp = await BSFetch.get(getRemindUserList, {
      params: {
        sceneType: 70
      }
    })
    if (resp.Code === 200) {
      return (resp.Data.RemindStaffList || resp.Data).map((item) => {
        return {
          Id: item.Id,
          Avatar: item.UserAvatar.Small,
          Name: item.Name,
          Email: item.Email,
          AvatarColor: item.UserAvatar.Color || '#f79c6f',
          Department: item.Department,
          DepartmentId: item.DepartmentId,
          TopDepartment: item.TopDepartment || item.TopDepartmentName,
          TopDepartmentName: item.TopDepartmentName || item.TopDepartment,
          // OrgFullName: item.OrgFullName,
        };
      });
    }
  } catch (error) {
    Message.error({
      // message: error.error ? error.error.message : error.statusText
      message: lang && locale[lang].network_error || '网络开小差，请稍后重试',
      showCloseButton: false,
    });
    return [];
  }

}

export const applicantSearchUserService = async (getSearchUserUrl, searchStr, lang?: string, isSeaarch = false) => {
  try {
    const resp = await BSFetch.get(getSearchUserUrl, {
      params: {
        filters: searchStr,
        isAuthorised: false,
        isWithoutDisabled: true,
        isOnlyStaff: false,
        isOnlyEnableUser: true,
      },
    })
    if (resp.Code === 1) { //Code返回了1 ,鲁林在排查，为了不影响demo先放开
      const data = resp.Data && resp.Data.SimpleUserModel;
      return data.map((item) => {
        return {
          Id: item.Id,
          Avatar: item.UserAvatar.Small,
          Name: item.Name,
          Email: item.Email,
          AvatarColor: item.UserAvatar.Color || '#f79c6f',
          Department: item.Department,
          DepartmentId: item.DepartmentId,
          TopDepartment: item.TopDepartment || item.TopDepartmentName,
          TopDepartmentName: item.TopDepartmentName || item.TopDepartment,
          OrgFullName: isSeaarch ? item.OrgFullName : "" ,
        };
      });
    }
  } catch (error) {
    Message.error({
      // message: error.error ? error.error.message : error.statusText
      message: lang && locale[lang].network_error || '网络开小差，请稍后重试',
      showCloseButton: false,
    });
    return [];
  }
}

export const createCommentService = async (createComment, time, applicantId, applyId, replyCommentId, isPrivate, val , location, lang?: string) => {
  try {
    const commonParams = {
      ApplicantId: applicantId, //应聘者ID
      Content: val, //备注内容
      ReplyCommentId: replyCommentId || '00000000-0000-0000-0000-000000000000',
      IsPrivate: isPrivate,
      RemindTime: time,
      ApplyId: applyId || '00000000-0000-0000-0000-000000000000',
      location
    }

    switch (location) {
      case 'applyDetail':
        delete commonParams.location;
        break;
      case 'talentBlackPage': // 人才详情黑名单的location 为了和基本信息保持一致改为blackTalentDetail 但接口没有改 固作下替换
      case 'blackTalentDetail':
        //人才详情黑名单页面
        delete commonParams.ApplyId;
        commonParams.location = 'talentBlackPage'
        break;
      default:
        delete commonParams.ApplyId;
        delete commonParams.location;
        break;
    }
    const resp = await BSFetch.post(createComment, {
      data: commonParams
    })
    return resp

  } catch (error) {
    Message.error({
      message: lang && locale[lang].network_error || '网络开小差，请稍后重试',
      showCloseButton: false,
      // message: error.error ? error.error.message : error.statusText
    });
    return null;
  }
}

// 批量添加备注
export const createBatchCommentService = async (createComment, applicants, val, isPrivate, arg, lang ) => {
  try {
    const commonParams = {
      Applicants: applicants, //应聘者
      Content: val, //备注内容
      IsPrivate: isPrivate,
      JobId: arg.JobId || "00000000-0000-0000-0000-000000000000",
      PhaseId: arg.BeforePhaseId || "00000000-0000-0000-0000-000000000000",
      StatusId: arg.BeforeStatusId || "00000000-0000-0000-0000-000000000000"
    }
    const resp = await BSFetch.post(createComment, {
      data: commonParams
    })
    return resp

  } catch (error) {
    Message.error({
      message: locale[lang].network_error || '网络开小差，请稍后重试',
      showCloseButton: false,
    });
    return null;
  }
}

export const getCommonUsedData = (contactPromiseUrl) => {
  return BSFetch.get(contactPromiseUrl, {
      params: {
        sceneType: 70
      },
    }).then(resp => {
      if(resp.Code === 200) {
        return formatUserData(resp.Data || []);
      }
  })
}

export const DefaultTimer = [
  {label: '半小时后',value: defaultTimeListValue.halfHour},
  {label: '一小时后',value: defaultTimeListValue.oneHour},
  {label: '明天九点',value: defaultTimeListValue.tomorrow},
  {label: '一周后',value: defaultTimeListValue.oneWeek},
  {label: '一个月后',value: defaultTimeListValue.oneMonth},
  {label: '三个月后',value: defaultTimeListValue.threeMonth}
];
const convert = (m) => {
  const minute = dayjs().add(m, 'minute').minute()
  const timePoint = [0, 15, 30, 45, 60]
  timePoint.sort((a, b) => {
    return Math.abs(a - minute) - Math.abs(b - minute)
  })
  return dayjs().add(m, 'minute').set('minute', timePoint[0]).format('YYYY/MM/DD HH:mm')
}
export const formatDefaultTimer = (option) => {
  const selected = option.selectOption.value
  switch (selected) {
    case defaultTimeListValue.halfHour:
      return convert(30)
    case defaultTimeListValue.oneHour:
      return convert(60)
    case defaultTimeListValue.tomorrow:
      return dayjs().add(1, 'day').set('hour', 9).set('minute', 0).format('YYYY/MM/DD HH:mm')
    case defaultTimeListValue.oneWeek:
      return dayjs().add(7, 'day').set('hour', 9).set('minute', 0).format('YYYY/MM/DD HH:mm')
    case defaultTimeListValue.oneMonth:
      return dayjs().add(1, 'month').set('hour', 9).set('minute', 0).format('YYYY/MM/DD HH:mm')
    case defaultTimeListValue.threeMonth:
      return dayjs().add(3, 'month').set('hour', 9).set('minute', 0).format('YYYY/MM/DD HH:mm')
    default:
      return ''
  }
}
const udcData = {
  applyDetail: 'ApplyDetail-',
  talentDetail: 'TalentDetail-',
  blackTalentDetail: 'TalentDetailBlack-'
}
export function reportUdcData(eventType, name, e, location) {
  let nameSplic = (udcData[location] ? udcData[location] : 'ApplyDetail-') + name
  //@ts-ignore
  window.udcJs && window.udcJs.externalCall &&
    //@ts-ignore
    window.udcJs.externalCall(
      {
        eventType: eventType, //必填， 事件类型，， 比如：click, 默认是report
        ext: {
          type: 'button',
          name: nameSplic,
        },
      },
      e
    );
}
export function formatTime(time) {
  return time ? time.replace(/\//g,'-') : ''
}

export const formateFormMetaData = (data) => {
  let CallUserIds = {
    isShowDepartmentName: false
  }

  data?.sub_cmps && data.sub_cmps[0].sub_cmps.forEach(item => {
    if(item?.cmp_data?.field_name === 'CallUserIds')  {
      CallUserIds = item.cmp_data
      CallUserIds['extraFieldInfo'] = {
            sceneType: 296
        }
    }
  })
  return {
    CallUserIds
  }
}

export const formatUserData = (data) => {
  return data.map((item) => {
    return {
      Id: item.Id,
      Avatar: item.UserAvatar.Small,
      Name: item.Name,
      Email: item.Email,
      AvatarColor: item.UserAvatar.Color || '#f79c6f',
      Department: item.Department,
      DepartmentId: item.DepartmentId,
      TopDepartment: item.TopDepartment || item.TopDepartmentName,
      TopDepartmentName: item.TopDepartmentName || item.TopDepartment,
      // OrgFullName: item.OrgFullName,
    }
  })
};

export const getFormViewData = () => {
  return BSFetch.get('/api/v2/UI/FormView', {
    params: {
      app: 'Recruitment',
      viewName: 'Recruitment.ApplicantCommnetForm',
      metaObjName: 'Recruitment.ApplicantCommnet',
      formState: 'create'
    }
  }).then((resp) => {
    return resp
  })
}