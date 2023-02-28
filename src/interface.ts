import React from 'react';
import locale from './locale';

export type ILang = keyof typeof locale;
interface ICommon {
  lang?: ILang;
  getHoverTips: string;
  isElink: boolean;
  location?: 'applyDetail' | 'aiRecommend' | 'talentDetail' | 'talentDetailElink' | 'blackTalentDetail' | 'talentDetailBlackElink';
}

interface ICommentCommon {
  PublishUser: {
    UserAvatar: { Color?: string; Small?: string }; //头像相关信息
    Name: string; //创建备注人的名字
    Id: number; //创建备注人的Id
  }; //创建备注的人
  JobName?: string; //职位名称
  PhaseName?: string; //阶段状态
  StatusName: string;
  CommentId: string; // 备注id
  IsReply: boolean; // 是否回复
  ParentUser: {
    Name?: string;
  }; //被回复者信息
  Content: string; //备注的内容
  CommentData: {
    Content: string;
    Email: string;
    UserName: string;
    UserId: number;
  }[];
  CreateDate: string; //备注的创建日期
  IsPrivate: boolean; // 是否为私密备注
  IsEdit: boolean;
  RemindTime: string;
  HasViewRemindTimePermission: boolean; // 是否有查看提醒时间的权限
};
export interface IReplyItemMain extends ICommon {
  comment: {
    PublishUser: {
      Name: string;
    }; // 备注创建者信息
    IsReply: boolean; // 是否回复
    ParentUser: {
      Name?: string;
    }; //被回复者信息
    Content: string; //备注的内容
    CommentData: {
      Content: string;
      Email: string;
      UserName: string;
      UserId: number;
    }[];
    CreateDate: string; //备注的创建日期
    IsPrivate: boolean; // 是否为私密备注
    IsEdit: boolean;
    RemindTime: string;
    CommentId: string;
    HasViewRemindTimePermission: boolean; // 是否有查看提醒时间的权限
  };
  isShowReminderBtn?: boolean;
}

export interface IOperation {
  onOperationClick: (target: HTMLElement, commentId: string, PublishUser: {}, IsPrivate: boolean) => void;
  commentId: string;
  publishUser: {};
  isPrivate: boolean;
  lang?: ILang;
  isEdit: boolean;
  isShowReply: boolean;  // 是否显示回复按钮
  location?: 'applyDetail' | 'aiRecommend' | 'talentDetail' | 'talentDetailElink' | 'blackTalentDetail' | 'talentDetailBlackElink';
}

export interface IReplyItem extends ICommon {
  isShowReply: boolean;  // 是否显示回复按钮
  comment: ICommentCommon;
  onOperationClick: (target: HTMLElement, commentId: string, PublishUser: {}, IsPrivate: boolean, popContainerRef: React.RefObject<any>) => void;
  isShowReminderBtn?: boolean;
}

export interface IReplyList extends ICommon {
  isShowReply: boolean;  // 是否显示回复按钮
  comments: ICommentCommon[];
  onReplyDelete: (target: HTMLElement, commentId: string, popContainerRef: React.RefObject<any>) => void;
  onReply: (commentId: string, PublishUser: {}, IsPrivate: boolean) => void;
  isShowReminderBtn?: boolean;
}
export interface IReplyPerson {
  replyUser?: string;
  onClose: () => void;
  lang?: ILang;
}

export interface IReply extends ICommon {
  comments: ICommentCommon[]; //备注的list数据
  total: number; //备注的总数量
  commentLimit: number; //允许显示的备注数量
  isShowReply: boolean;  // 是否显示回复按钮
  onReplyDelete: (target: HTMLElement, commentId: string, popContainerRef: React.RefObject<any>) => void;
  onReply: (commentId: string, PublishUser: {}, IsPrivate: boolean) => void;
  isShowReminderBtn?: boolean;
}

export interface IComment {
  lang?: ILang;
  isElink: boolean;
  location?: 'applyDetail' | 'aiRecommend' | 'talentDetail' | 'talentDetailElink' | 'blackTalentDetail' | 'talentDetailBlackElink';
  Urls: {
    getApplicantComment: string; //所有备注
    deleteComment: string; //删除备注
    createComment: string; //创建备注
    getRemindUserList: string; //获取@用户列表
    getSearchUserUrl: string; //应聘者详情页面选人组件搜索接口
    getHoverTips: string; //应聘者详情页面所艾特的人 鼠标悬浮在上面显示邮箱和阶段状态
    createBatchComment?: string; //批量添加备注
  };
  applicantId: string;
  applyId?: string;
  commentId: string;
  isHideCommit?: boolean;  // 是否隐藏评论区
  onSaveError: (resp, actionType) => void;
  onSaveSuccess: (resp) => void;
  onSuccess?: (resp, actionType) => void;
  onChange?: (value) => void;
  triggerCommentDeleted?: () => void;
  isShowTitle?: boolean;
  isShowList?: boolean;
  applicants?: Array<ApplicantsInfo>;
  isShowMentionBtn?: boolean;
  isShowReminderBtn?: boolean;
  onClose?: any;
  onModify?: any;
  baseParams?: {
    JobId: string;
    BeforePhaseId: string;
    BeforeStatusId: string;
  };
  remarkRemindAllUser?: boolean;
  actionType?: string;
  actionTitle?: string;
  pageTypeApproval?: string; // 是否来自于审批详情页，审批详情页使用该组件只能查看，不能删除、回复、新增备注
}
interface ApplicantsInfo{
  ApplicantId: string;    // 应聘者ID
  ApplyId?: string;       // 申请记录ID
  Name?: string;       // 申请记录ID
}

export type IRef = React.RefAttributes<{
  refresh: () => void;
}>;
export interface ICommentContext {
  onDeleteRemindTime: (commentId: string) => void;
}
export interface IRemindTimerProps {
  lang?: ILang; 
  time: string;
  timeError: boolean;
  onSelect: (time: string) => void;
  onDelete: () => void;
  bellLayerContainer?: React.RefObject<HTMLDivElement>;
}
export enum defaultTimeListValue {
  halfHour,
  oneHour,
  tomorrow,
  oneWeek,
  oneMonth,
  threeMonth
}
const CommentContext = React.createContext({} as ICommentContext);

export default CommentContext;