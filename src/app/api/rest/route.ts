import { ApiDef } from '../../../common'
import * as dotenv from 'dotenv'
dotenv.config()

export async function GET(request: Request) {
  
  console.log('GET request received');

  if(process.env.ACCESS_EXPRESS_SERVER === 'true') {
    console.log('GET server url:', process.env.EXPRESS_SERVER_URL);
  
    try {
      const response = await fetch(process.env.EXPRESS_SERVER_URL!, {cache: "reload"});
      const data = await response.text();
      console.log('GET response from server:', data);
  
      const res: ApiDef.User = { name: data};
      // Process the data and return a response to the client
      return new Response(JSON.stringify(res), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      // Handle any errors
      console.error(error);
      return new Response('An error occurred', { status: 500 });
    }
  }else {
    return new Response(JSON.stringify({name:"return from Nextjs server"}), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
  }
} 