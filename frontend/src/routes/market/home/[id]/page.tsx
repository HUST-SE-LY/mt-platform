import { NeedStatus, NeedType, ReplyStatus } from '@/consts';
import { IconArrowRight } from '@douyinfe/semi-icons';
import { Avatar, Button, Tag, TextArea } from '@douyinfe/semi-ui';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';
import { useParams } from '@modern-js/runtime/router';
import { Fragment, useEffect, useState } from 'react';
import '@/routes/index.css';
interface NeedDetail {
  title: string;
  author: string;
  date: string;
  type: NeedType;
  originLanguage: string;
  targetLanguage: string;
  doc?: string[];
  paragraph?: string;
  price: number;
  status: NeedStatus;
  hasReply: Boolean;
  reply?: string[] | string;
  isMy?: boolean;
  replies?: {
    author: string;
    date: string;
    content: string[] | string;
    status: ReplyStatus;
  }[];
}

export default () => {
  const params = useParams();
  console.log(params.id);
  const [needInfo, setNeedInfo] = useState<NeedDetail>();
  const [paragraphReply, setParagraphReply] = useState('');
  const [docReply, setDocReply] = useState<string[]>([]);
  const replyDoc = async () => {
    console.log(docReply);
  };
  useEffect(() => {
    setNeedInfo({
      title: '测试需求',
      author: '测试用户',
      date: '2025-1-16',
      type: 0,
      originLanguage: '英文',
      targetLanguage: '中文',
      doc: [
        'Your fingertips on my skin,Your fingertips on my skin,Your fingertips on my skin,Your fingertips on my skin,Your fingertips on my skin,Your fingertips on my skin,Your fingertips on my skin,Your fingertips on my skin,Your fingertips on my skin,Your fingertips on my skin,Your fingertips on my skin,Your fingertips on my skin,Your fingertips on my skin,Your fingertips on my skin,Your fingertips on my skin,Your fingertips on my skin,Your fingertips on my skin,Your fingertips on my skin,Your fingertips on my skin,Your fingertips on my skin',
        'Theres nothing that',
        'And we cant fix it',
        'To keep this love alive',
      ],
      paragraph: 'Your fingertips on my skin',
      price: 99,
      status: 0,
      hasReply: false,
      isMy: true,
      replies: [
        {
          author: '小明',
          date: '2025-1-12 12:20:46',
          content: [
            '这是第一段翻译',
            '这是第二段翻译',
            '这是第三段翻译',
            '这是第四段翻译',
          ],
          status: 0,
        },
        {
          author: '小明',
          date: '2025-1-12 12:20:46',
          content: [
            '这是第一段翻译',
            '这是第二段翻译',
            '这是第三段翻译',
            '这是第四段翻译',
          ],
          status: 1,
        },
        {
          author: '小明',
          date: '2025-1-12 12:20:46',
          content: [
            '这是第一段翻译',
            '这是第二段翻译',
            '这是第三段翻译',
            '这是第四段翻译',
          ],
          status: 1,
        },
      ],
    });
  }, []);
  return (
    <div
      style={{
        padding: 16,
      }}
    >
      <Title heading={2}>
        {needInfo?.title}（{needInfo?.price}¥）
      </Title>
      <div
        style={{
          marginTop: 16,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Avatar size="small" color="green">
          {needInfo?.author[0]}
        </Avatar>
        <span style={{ marginLeft: 8 }}>{needInfo?.author}</span>
        <span
          style={{
            fontSize: 14,
            color: 'gray',
            marginLeft: 8,
          }}
        >
          {needInfo?.date}发布
        </span>
        <Tag style={{ marginLeft: 8 }} color="blue">
          {needInfo?.type == NeedType.doc ? '文档' : '文本段'}
        </Tag>
        <Tag
          style={{ marginLeft: 8 }}
          color={needInfo?.status === NeedStatus.processing ? 'green' : 'grey'}
        >
          {needInfo?.status === NeedStatus.processing ? '进行中' : '已结束'}
        </Tag>
      </div>
      <div
        style={{
          marginTop: 16,
        }}
      >
        <span
          style={{
            fontWeight: 'bold',
          }}
        >
          语言要求：
        </span>
        <span
          style={{
            marginLeft: 8,
          }}
        >
          {needInfo?.originLanguage}
        </span>
        <IconArrowRight
          style={{
            marginLeft: 8,
          }}
          size="small"
        />
        <span
          style={{
            marginLeft: 8,
          }}
        >
          {needInfo?.targetLanguage}
        </span>
      </div>
      <div
        style={{
          marginTop: 16,
        }}
      >
        {needInfo?.isMy ? (
          <div>
            <Title
              style={{
                marginTop: 24,
              }}
              heading={4}
            >
              回答记录
            </Title>
            {needInfo.replies?.map((el) => {
              return (
                <div
                  style={{
                    borderRadius: 16,
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    padding: 16,
                    marginTop: 12,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Avatar size="extra-small" color="green">
                      {el.author[0]}
                    </Avatar>
                    <span style={{ marginLeft: 8, fontSize: 14 }}>
                      {el?.author}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: 'gray',
                        marginLeft: 8,
                      }}
                    >
                      于{needInfo?.date}回答
                    </span>
                    {
                      el.status === ReplyStatus.accept && <Tag style={{
                        marginLeft: 8
                      }} color='green'>已采纳</Tag>
                    }
                    {
                      needInfo.status === NeedStatus.processing && <Button style={{
                        width: 72,
                        marginLeft: 16,
                        borderRadius: 16
                      }}>采纳</Button>
                    }
                  </div>
                  {needInfo?.type === NeedType.doc && needInfo?.doc && (
                    <div
                      style={{
                        padding: 16,
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 16,
                      }}
                    >
                      <p
                        style={{
                          fontWeight: 'bold',
                        }}
                      >
                        原文
                      </p>
                      <p
                        style={{
                          fontWeight: 'bold',
                        }}
                      >
                        译文
                      </p>
                      {needInfo.doc.map((text, index) => (
                        <Fragment key={index}>
                          <div
                            style={{
                              padding: 12,
                              background: 'rgba(0, 0, 0, 0.03)',
                              borderRadius: 12,
                            }}
                          >
                            {text}
                          </div>
                          <div
                            style={{
                              padding: 12,
                              background: 'rgba(0, 0, 0, 0.03)',
                              borderRadius: 12,
                            }}
                          >
                            {(el.content as string[])[index]}
                          </div>
                        </Fragment>
                      ))}
                      
                    </div>
                  )}
                  {needInfo?.type === NeedType.paragraph &&
                    needInfo?.paragraph && (
                      <div
                        style={{
                          padding: 16,
                          width: 600,
                        }}
                      >
                        <div
                          style={{
                            padding: 12,
                            borderRadius: 12,
                            background: 'rgba(0, 0, 0, 0.03)',
                          }}
                        >
                          <p
                            style={{
                              fontWeight: 'bold',
                            }}
                          >
                            原文：
                          </p>
                          {needInfo.paragraph}
                        </div>
                        {!!needInfo?.hasReply && (
                          <p
                            style={{
                              marginTop: 16,
                              fontWeight: 'bold',
                            }}
                          >
                            我的回答
                          </p>
                        )}
                        <TextArea
                          disabled={!!needInfo?.hasReply}
                          placeholder="输入你的解答"
                          style={{
                            marginTop: 16,
                            borderRadius: 12,
                            padding: 12,
                          }}
                        />
                        {!needInfo?.hasReply && (
                          <Button
                            style={{
                              marginTop: 16,
                              borderRadius: 12,
                              width: 72,
                            }}
                          >
                            提交
                          </Button>
                        )}
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        ) : (
          <>
            {needInfo?.type === NeedType.doc && needInfo?.doc && (
              <div
                style={{
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: 16,
                  padding: 16,
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 16,
                }}
              >
                <p
                  style={{
                    fontWeight: 'bold',
                  }}
                >
                  原文
                </p>
                <p
                  style={{
                    fontWeight: 'bold',
                  }}
                >
                  {needInfo?.hasReply ? '我的回答' : '译文'}
                </p>
                {needInfo.doc.map((el, index) => (
                  <Fragment key={index}>
                    <div
                      style={{
                        padding: 12,
                        background: 'rgba(0, 0, 0, 0.03)',
                        borderRadius: 12,
                      }}
                    >
                      {el}
                    </div>
                    <TextArea
                      value={docReply[index] || ''}
                      onChange={(e) =>
                        setDocReply((prev) => {
                          const temp = [...prev];
                          temp[index] = e;
                          return temp;
                        })
                      }
                      disabled={!!needInfo?.hasReply}
                      placeholder="输入你的解答"
                      style={{
                        borderRadius: 12,
                        padding: 12,
                      }}
                    />
                  </Fragment>
                ))}
                {!needInfo?.hasReply && (
                  <Button
                    style={{
                      borderRadius: 12,
                    }}
                    onClick={replyDoc}
                  >
                    提交
                  </Button>
                )}
              </div>
            )}
            {needInfo?.type === NeedType.paragraph && needInfo?.paragraph && (
              <div
                style={{
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: 16,
                  padding: 16,
                  width: 600,
                }}
              >
                <div
                  style={{
                    padding: 12,
                    borderRadius: 12,
                    background: 'rgba(0, 0, 0, 0.03)',
                  }}
                >
                  <p
                    style={{
                      fontWeight: 'bold',
                    }}
                  >
                    原文：
                  </p>
                  {needInfo.paragraph}
                </div>
                {!!needInfo?.hasReply && (
                  <p
                    style={{
                      marginTop: 16,
                      fontWeight: 'bold',
                    }}
                  >
                    我的回答
                  </p>
                )}
                <TextArea
                  disabled={!!needInfo?.hasReply}
                  placeholder="输入你的解答"
                  style={{
                    marginTop: 16,
                    borderRadius: 12,
                    padding: 12,
                  }}
                />
                {!needInfo?.hasReply && (
                  <Button
                    style={{
                      marginTop: 16,
                      borderRadius: 12,
                      width: 72,
                    }}
                  >
                    提交
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
