import { ApiDef } from '../../common'

export async function GET(request:Request) {
    //create a data object according to interface ApiDef["User"]
    let data:ApiDef.User = {name:"This is the user information from the nextjs server"}
    //return the data object as a JSON string
    return new Response(JSON.stringify(data), { status: 200 })
    
}