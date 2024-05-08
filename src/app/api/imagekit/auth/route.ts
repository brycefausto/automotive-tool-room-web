import { imagekit } from '@/config/imagekit';

export async function POST(request: Request) {
  const authenticationParameters = imagekit.getAuthenticationParameters();

  return Response.json(authenticationParameters)
}