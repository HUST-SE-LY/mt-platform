export enum UserType {
  Normal = 'Normal',
  Advertiser = 'Advertiser',
  Pro = 'Pro',
  Enterprise = 'Enterprise',
  Admin = 'Admin',
}

export enum AdsStatusEnum {
  Normal = 'active',
  Stop = 'paused',
  Auditing = 'under_review',
  Illegal = 'rejected',
}

export enum NeedStatus {
  processing,
  end
}

export enum NeedType {
  doc,
  paragraph
}

export enum ReplyStatus {
  accept,
  waiting,
}
