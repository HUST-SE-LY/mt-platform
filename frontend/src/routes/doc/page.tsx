import { copyText } from '@/utils/copyText';
import { Card, Col, Divider, Row } from '@douyinfe/semi-ui';
import Title from '@douyinfe/semi-ui/lib/es/typography/title';
import clsx from 'clsx';
import { useState } from 'react';

export default () => {
  const [currentHover, setCurrentHover] = useState(-1);
  const translateRes = [
    {
      origin: '心に穴が空きそうだ',
      target: '心里似乎空了一个洞',
    },
    {
      origin: '今年の夏も壊れそうだ',
      target: '今年的夏天也像坏掉了一样',
    },
    {
      origin:
        'どうしようもないことだけ歌いたかった、睡蓮が浮いていた 水圧で透明だ、もう蜃気楼よりも確かならそれでいいよ、このまま何処でもいいからさ、このまま何処でもいいからさ、逃げよう',
      target:
        '只是想说些无济于事的话罢了，睡莲漂浮着 因水压而变得透明，如果已经比海市蜃楼更让人有实感的话 就足够了，随便怎么样都好了 目的什么的也无所谓了',
    },
    {
      origin: '心に穴が空きそうだ',
      target: '心里似乎空了一个洞',
    },
    {
      origin: '今年の夏も壊れそうだ',
      target: '今年的夏天也像坏掉了一样',
    },
    {
      origin:
        'どうしようもないことだけ歌いたかった、睡蓮が浮いていた 水圧で透明だ、もう蜃気楼よりも確かならそれでいいよ、このまま何処でもいいからさ、このまま何処でもいいからさ、逃げよう',
      target:
        '只是想说些无济于事的话罢了，睡莲漂浮着 因水压而变得透明，如果已经比海市蜃楼更让人有实感的话 就足够了，随便怎么样都好了 目的什么的也无所谓了',
    },
  ];
  return (
    <div>
      <Row>
        <Col
          span={11}
          style={{
            padding: 16,
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
              onClick={() => copyText(el.origin)}
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
                }}
              >
                {el.origin}
              </Card>
            </div>
          ))}
        </Col>
        <Col
          span={2}
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Divider
            style={{
              height: '100vh',
            }}
            layout="vertical"
            margin="12px"
          />
        </Col>
        <Col
          span={11}
          style={{
            padding: 16,
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
              onClick={() => copyText(el.target)}
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
                }}
              >
                {el.target}
              </Card>
            </div>
          ))}
        </Col>
      </Row>
    </div>
  );
};
