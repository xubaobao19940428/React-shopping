import React, {useState} from 'react'
import { Tabs, Radio, Button } from 'antd'
import ViewContainer from '@/components/ViewContainer'
import { useModel } from 'umi'
import ScreenAdList from './components/ScreenAdList'
import BombScreenList from './components/BombScreenList'
import MarketingModelList from './components/MarketingModelList'
import CommonSetList from './components/CommonSetList'
import BottomIconList from './components/BottomIconList'
import CategoryOperation from './components/CategoryOperationList'
import ServiceToolsList from './components/ServiceToolsList'
import commonEnum from './enum'
import SortModal from './components/SortModal'

const { OPEN_TYPE_LIST, OPEN_TYPE_OBJ, PERSON_TYPE_OBJ, APP_PAGE_ENUM, APP_MODE_LIST, APP_MODE_DETAIL_OBJ,
    PERSON_TYPE_LIST, SERVICE_STATUS_OBJ, SERVICE_TOOLS_ENUM, SERVICE_STATUS_LIST } = commonEnum

const { TabPane } = Tabs

const components = {
    ScreenAdList,
    BombScreenList,
    MarketingModelList,
    BottomIconList,
    CategoryOperation,
    ServiceToolsList
}

const Page = (props) => {
    let Handler = components[props.curTab];
    if (!props.moduleData.isCustomize) {
        Handler = CommonSetList
    }
    return <Handler {...props} />
}

const AppSet = () => {
    const [curMode, setCurMode] = useState('screen')
    const { countries, languages } = useModel('dictionary')
    const [curTab, setCurTab] = useState('ScreenAdList')
    const [showModal, setShowModal] = useState(false)

    const Operations = curMode == 'home' && <Button type="primary" onClick={() => handleSort()}>排序</Button>

    function handleRadioChange(e) {
        setCurMode(e.target.value)
        APP_MODE_DETAIL_OBJ[e.target.value][0] && handleTabChange(APP_MODE_DETAIL_OBJ[e.target.value][0].key)
    }

    function handleTabChange(key) {
        setCurTab(key)
    }

    function handleSort () {
        setShowModal(true)
    }

    function handleSortCancel () {
        setShowModal(false)
    }

    return (
        <ViewContainer>
            <Radio.Group onChange={handleRadioChange} value={curMode}>
                {
                    APP_MODE_LIST.map((item) => <Radio.Button value={item.key} key={item.key}>{item.name}</Radio.Button>)
                }
            </Radio.Group>
            <Tabs defaultActiveKey={curTab} onChange={handleTabChange} tabBarExtraContent={Operations}>
                {
                    APP_MODE_DETAIL_OBJ[curMode].map((tab) => (
                        <TabPane tab={tab.name} key={tab.key}>
                            {
                                tab.key == curTab &&
                                <Page curTab={tab.key}
                                      curMode={curMode}
                                      moduleData={tab}
                                      countries={countries}
                                      languages={languages}
                                      PERSON_TYPE_LIST={PERSON_TYPE_LIST}
                                      OPEN_TYPE_LIST={OPEN_TYPE_LIST}
                                      SERVICE_STATUS_OBJ={SERVICE_STATUS_OBJ}
                                      SERVICE_STATUS_LIST={SERVICE_STATUS_LIST}
                                      APP_MODE_DETAIL_OBJ={APP_MODE_DETAIL_OBJ}
                                      OPEN_TYPE_OBJ={OPEN_TYPE_OBJ}
                                      APP_PAGE_ENUM={APP_PAGE_ENUM}
                                      SERVICE_TOOLS_ENUM={SERVICE_TOOLS_ENUM}
                                      PERSON_TYPE_OBJ={PERSON_TYPE_OBJ}/>
                            }
                        </TabPane>
                    ))
                }
            </Tabs>

            <SortModal
                showModal={showModal}
                countries={countries}
                onCancel={handleSortCancel}/>

        </ViewContainer>
    )
}

export default AppSet
