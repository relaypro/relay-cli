import { NewTask } from './api'
import { TaskFlags } from './flags'

export const appendTag = (jsonObj: any, tag: string): any => {
    jsonObj["tags"] = tag
    return jsonObj
}

export const deviceUri = (deviceName: string): string => {
    var deviceUri = deviceName
    if (deviceName.substring(0,3) != "urn") {
        deviceUri = "urn:relay-resource:name:device:" + encodeURI(deviceName.toLowerCase())
    }
    return deviceUri
}

export const createTask = async (flags: TaskFlags, taskTypeNamespace: string): Promise<NewTask> => {  
    const task: NewTask = {
        task_type_name: flags.task_type_name,
        task_type_major: flags.task_type_major,
        task_name: flags.task_name,
        assign_to: [deviceUri(flags.assign_to)],
        task_type_namespace: taskTypeNamespace,
        args: flags.args,
    }
    return task
}