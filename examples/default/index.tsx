import React from 'react';
import Comment from './../../src/index';

export default (props) => {
  // const Urls = {
  //   getApplicantComment: '/mrest/Recruitment/RecruitmentV6/100000/ApplicantComment/GetApplicantComment',
  //   getRemindUserList: '/mrest/Recruitment/RecruitmentV6/100000/ApplicantComment/GetRemindUserList',
  //   createComment: '/mrest/Recruitment/RecruitmentV6/100000/ApplicantComment/CreateComment',
  //   deleteComment: '/mrest/Recruitment/RecruitmentV6/100000/ApplicantComment/DeleteComment',
  //   getHoverTips: '/mrest/Recruitment/RecruitmentV6/100000/ApplicantComment/GetRemindUserInfo',
  //   getSearchUserUrl: '/AppFSystemMRest/100000/UserControl/GetUsersByKeyword'
  // };
  const Urls = {
    getApplicantComment: 'http://cloud.italent-inc.cn/mrest/Recruitment/RecruitmentV6/100000/ApplicantComment/GetApplicantComment',
    getRemindUserList: 'http://cloud.italent-inc.cn/mrest/Recruitment/RecruitmentV6/100000/ApplicantComment/GetRemindUserList', //elink接口
    // getRemindUserList: 'http://cloud.italent-inc.cn/mrest/Recruitment/RecruitV6AccountMR/100000/AccountStaff/GetCommonUsedData',//应聘者详情
    createComment: 'http://cloud.italent-inc.cn/mrest/Recruitment/RecruitmentV6/100000/ApplicantComment/CreateComment',
    deleteComment: 'http://cloud.italent-inc.cn/mrest/Recruitment/RecruitmentV6/100000/ApplicantComment/DeleteComment',
    getHoverTips: 'http://cloud.italent-inc.cn/mrest/Recruitment/RecruitmentV6/100000/ApplicantComment/GetRemindUserInfo',
    getSearchUserUrl: 'http://cloud.italent-inc.cn/AppFSystemMRest/100000/UserControl/GetUsersByKeyword',
  };
  return <Comment Urls={Urls}
    isElink={false}
    applyId="6fe75ee1-0431-408a-a391-b2602a43161e"
    applicantId="1c9ca655-5ea7-402e-8aed-28710525208a"
    onSaveError={() => { }}
  />;
};
