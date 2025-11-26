import "fastify";

declare module "fastify" {
  export interface FastifyRequest {
    cookies: {
      sessionId?: string;
      [key: string]: string | undefined;
    };
    user?: {
      id: string;
      name: string;
      email: string;
    };
  }
}
