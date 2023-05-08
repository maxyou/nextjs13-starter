import { ApiDef } from '../../common'
import * as dotenv from 'dotenv'
dotenv.config()

export async function GET(request: Request) {
    console.log('GET server url:', process.env.EXPRESS_SERVER_URL);
  
    try {
      const response = await fetch(process.env.EXPRESS_SERVER_URL!);
      const data = await response.text();
      console.log('GET res from server:', data);
  
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
  }
  