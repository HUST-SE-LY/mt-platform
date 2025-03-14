import '@/routes/index.css';
import { Button, Descriptions, Table } from '@douyinfe/semi-ui';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';
import { useNavigate, useParams } from '@modern-js/runtime/router';
import { useEffect, useMemo, useState } from 'react';

interface ProjectInfo {
  id: number;
  name: string;
  docNum: number;
  originLanguage: string;
  targetLanguage: string;
  creator: string;
}

interface DocInfo {
  id: number;
  name: string;
  creator: string;
  createTime: string;
  size: number;
}

export default () => {
  const [basicInfo, setBasicInfo] = useState<ProjectInfo>();
  const descInfo = useMemo(() => {
    const { name, docNum, originLanguage, targetLanguage, creator } =
      basicInfo || {};
    return [
      {
        key: '项目名',
        value: name,
      },
      {
        key: '文档数',
        value: docNum,
      },
      {
        key: '源语言',
        value: originLanguage,
      },
      {
        key: '目标语言',
        value: targetLanguage,
      },
      {
        key: '创建人',
        value: creator,
      },
    ];
  }, [basicInfo]);
  const [docList, setDocList] = useState<DocInfo[]>([]);
  const { id } = useParams();
  const nav = useNavigate();
  const columns = [
    {
      title: '文档名',
      dataIndex: 'name',
    },
    {
      title: '创建人',
      dataIndex: 'creator',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '大小',
      dataIndex: 'size',
      render: (size: number) => <p>{size}KB</p>
    },
    {
      title: '操作',
      dataIndex: 'id',
      render: () => {
        return (
          <>
            <Button
              style={{
                marginLeft: 8,
              }}
            >
              查看
            </Button>
            <Button
              style={{
                marginLeft: 8,
              }}
            >
              导出
            </Button>
            <Button
              type="danger"
              style={{
                marginLeft: 8,
              }}
            >
              删除
            </Button>
          </>
        );
      },
    },
  ];
  useEffect(() => {
    setBasicInfo({
      id: 1,
      name: '项目1',
      docNum: 3,
      originLanguage: '中文',
      targetLanguage: '英文',
      creator: '阿健',
    });
    setDocList([{
      id: 1,
      name: '文档1.docx',
      creator: '小明',
      createTime: '2025-01-12',
      size: 51,
    }])
  }, []);
  return (
    <div>
      <Title heading={4}>基本信息</Title>
      <Descriptions
        style={{
          marginTop: 12,
          marginBottom: 32,
        }}
        column={3}
        layout="horizontal"
        align="plain"
        data={descInfo}
      />
      <Title heading={4}>文档列表</Title>
      <Table columns={columns} dataSource={docList} />
    </div>
  );
};
