import { AdsStatusEnum } from "@/consts"
import { Tag } from "@douyinfe/semi-ui"

export const AdsStatus = ({status}: {
  status: AdsStatusEnum
}) => {
    switch(status) {
      case AdsStatusEnum.Auditing:
        return <Tag color="blue">审核中</Tag>;
      case AdsStatusEnum.Illegal:
        return <Tag color="red">审核不通过</Tag>
      case AdsStatusEnum.Normal:
        return <Tag color="green">正常展示中</Tag>
      case AdsStatusEnum.Stop:
        return <Tag color="grey">暂停展示中</Tag>
    }
}