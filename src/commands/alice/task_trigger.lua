relay = require 'relay'

-- {"args":{"phrase":"capsule demo","source_uri":"urn:relay-resource:name:device:Orange"},"type":"phrase"}
--
-- {"args":{"nfc_payload":{"category":"my_category","label":"Location 2"},"source_uri":"urn:relay-resource:name:device:my%20dog","uid":"045818ca967380"},"type":"nfc"}

local function get_device_name(source_uri)
    local prefix = 'urn:relay-resource:name:device:'
    local encoded_device_name = source_uri:sub(#prefix+1)
    local device_name = encoded_device_name:gsub('%%20', ' ')
    return device_name
end

local task_args = relay.args.task_args or {}

if relay.trigger.type == 'phrase' then
    task_args.event = {
        is_speech=true,
        device=get_device_name(relay.trigger.args.source_uri),
        phrase=relay.trigger.args.phrase,
        spillover=relay.trigger.args.spillover
    }

elseif relay.trigger.type == 'nfc' then
    task_args.event = {
        is_nfc_tap=true,
        device=get_device_name(relay.trigger.args.source_uri),
        content=relay.trigger.args.nfc_payload
    }

else
    relay.say('error: unexpected trigger '..relay.trigger.type, { relay.trigger.args.source_uri })
end

if task_args.event then
    relay.start_task(relay.args.task_type, relay.args.task_name, task_args, { relay.trigger.args.source_uri })
end
