import { copyText } from '@/utils/copyText';
import { http } from '@/utils/http';
import { Card, Col, Divider, Row, Toast } from '@douyinfe/semi-ui';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';
import { useParams } from '@modern-js/runtime/router';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

export default () => {
  const [currentHover, setCurrentHover] = useState(-1);
  const {id} = useParams();
  const [translateRes, setTranslateRes] = useState<{
    original_text: string;
    translated_text: string;
  }[]>([]);
  useEffect(() => {
    http.get<any>(`/document/status/${id}`).then((res) => {
      if(res.status === 'translating') {
        Toast.info('文档仍在翻译中，请稍后重试');
        return ;
      }
      setTranslateRes(res.segments);
    })
  }, [])
  return (
    <div>
      <Row>
        <Col span={12}>
          <div
            style={{
              margin: 16,
              padding: 16,
              background: 'rgba(0, 0, 0, 0.02)',
              borderRadius: 24,
            }}
          >
            <Title
              style={{
                fontSize: 20,
              }}
            >
              文档经提取后的原文
            </Title>
            {translateRes.map((el, index) => (
              <div
                key={index}
                onMouseEnter={() => setCurrentHover(index)}
                onMouseLeave={() => setCurrentHover(-1)}
                onClick={() => copyText(el.original_text)}
              >
                <Card
                  className={clsx(
                    currentHover === index
                      ? 'semi-card-shadows semi-card-shadows-always'
                      : 'bold-with-hover'
                  )}
                  style={{
                    height: 150,
                    overflow: 'auto',
                    marginTop: 8,
                    borderRadius: 16,
                    transition: 'all 0.5s',
                  }}
                >
                  <pre>{el.original_text}</pre>
                </Card>
              </div>
            ))}
          </div>
        </Col>

        <Col span={12}>
          <div
            style={{
              margin: 16,
              padding: 16,
              background: 'rgba(0, 0, 0, 0.02)',
              borderRadius: 24,
            }}
          >
            <Title
              style={{
                fontSize: 20,
              }}
            >
              对照翻译
            </Title>
            {translateRes.map((el, index) => (
              <div
                key={index}
                onMouseEnter={() => setCurrentHover(index)}
                onMouseLeave={() => setCurrentHover(-1)}
                onClick={() => copyText(el.translated_text)}
              >
                <Card
                  className={clsx(
                    currentHover === index
                      ? 'semi-card-shadows semi-card-shadows-always'
                      : ''
                  )}
                  style={{
                    height: 150,
                    overflow: 'auto',
                    marginTop: 8,
                    transition: 'all 0.5s',
                    borderRadius: 16,
                    
                  }}
                >
                  <pre>{el.translated_text}</pre>
                </Card>
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </div>
  );
};
