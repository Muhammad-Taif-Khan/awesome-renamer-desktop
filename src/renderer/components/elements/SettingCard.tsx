import { Flex, Space, Typography } from 'antd'

type SettingCardProps = {
    actionElement: React.ReactNode;
    title: React.ReactNode;
    description: React.ReactNode
}

function SettingCard({actionElement, title, description}: SettingCardProps):React.ReactNode {
  return (
    <div  style={{width: '90%', margin: 20}} >
        <Flex style={{width: "100%"}} justify='space-between' align='center'>
            <Space  vertical>
                <Typography.Title level={5}>{title}</Typography.Title>
                <Typography.Text  type='secondary'>{description}</Typography.Text>
            </Space>
            <Space vertical>
                {actionElement}
            </Space>
        </Flex>
    </div>
  )
}

export default SettingCard