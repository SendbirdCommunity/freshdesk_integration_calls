var outGoingCall;
var client;
var callee;
var sendbirdUser;

//Fetch app and get the ticket creator detail.
//Then initialize Sendbird.
(async () => {
    try {
        client = await app.initialized()
        const context = await client.instance.context()

        //Data is being passed from app.js and its client.interface.trigger("showModal") method.
        callee = context.data.ticketCreatorData.contact
        agent = context.data.agentData.loggedInUser
        sendbirdUser = context.data.sendbirdUser

        document.getElementById("details")
        .innerHTML = `You can now call ${callee.name} with the id ${callee.id}`
        //Build the sendbird call instance but don't login until calling is needed.
        initSendbirdCalls()
    } catch(e){
        throw Error(e)
    }
})()


async function initSendbirdCalls() {
    //In production add the app_id to the installation params.
    SendBirdCall.init(YOUR_SENDBIRD_APP_ID)
    try {
        //The user credentials were fetched using the API call from server.js.
        //server.js was called from app.js
        //app.js passed the server.js response to the context in this modal.js file.
        await SendBirdCall.authenticate({
            userId: sendbirdUser.sendbirdUserId,
            accessToken: sendbirdUser.access_token
        })
        // addSendbirdCallsListener()
    } catch (error) {
        throw Error(error)
    }

}

const addSendbirdCallsListener = (outGoingCall) => {
    // All outgoing call events here -->  https://sendbird.com/docs/calls/v1/javascript/guides/direct-call#2-make-a-call
    const infoTag =  document.getElementById("details")
    infoTag.innerHTML = `Agent ${agent.contact.name} is calling customer ${callee.name}`

    outGoingCall.onConnected = (call) => {
        infoTag.innerHTML = `${callee.name} answered the your call`
        console.log(call)
    }
    outGoingCall.onEnded = (call) => {
        infoTag.innerHTML = `Call eneded. You can now call ${callee.name} with the id ${callee.id}`
        console.log(call)
    }
}



async function callCustomer () {

    const dialParams = {

        userId: JSON.stringify(callee.id),
        isVideoCall: true,
        callOption: {
            remoteMediaView: document.getElementById('remote_video_element_id'),
            audioEnabled: true,
            videoEnabled: false }
        };

    try {
        const connection = await SendBirdCall.connectWebSocket()
        console.log(connection)
        outGoingCall = await SendBirdCall.dial(dialParams)
        addSendbirdCallsListener(outGoingCall)
    } catch(e){
        throw Error(e)
    }
}

const endCall = () => outGoingCall.end()

