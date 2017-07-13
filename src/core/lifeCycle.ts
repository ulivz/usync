import {ILifecycleMap} from '../../types/Usync'

const LIFE_CYCLE = {
    appStart: 1,
    taskStart: 2,
    taskEnd: 3,
    appEnd: 4
}

export default {
    init () {
        let list = <ILifecycleMap>{}
        for (let cycle of Object.keys(LIFE_CYCLE)) {
            list[cycle + 'Quene'] = []
        }
        return <ILifecycleMap>list;
    }
}

