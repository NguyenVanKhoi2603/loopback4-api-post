// import {MiddlewareSequence} from '@loopback/rest';

// export class MySequence extends MiddlewareSequence {}

import {
  AuthenticateFn,
  AuthenticationBindings,
  AUTHENTICATION_STRATEGY_NOT_FOUND,
  USER_PROFILE_NOT_FOUND
} from '@loopback/authentication';
import {inject} from '@loopback/context';
import {FindRoute, InvokeMethod, InvokeMiddleware, InvokeMiddlewareOptions, MiddlewareSequence, ParseParams, Reject, RequestContext, Send, SequenceActions, SequenceHandler} from '@loopback/rest';
// ------------------------------------
export class MySequence implements SequenceHandler {

  static defaultOptions: InvokeMiddlewareOptions = {
    chain: 'middlewareChain.rest',
    orderedGroups: [
      // Please note that middleware is cascading. The `sendResponse` is
      // added first to invoke downstream middleware to get the result or
      // catch errors so that it can produce the http response.
      'sendResponse',

      // default
      'cors',
      'apiSpec',

      // default
      'middleware',

      // rest
      'findRoute',

      // authentication
      'authentication',

      // rest
      'parseParams',
      'invokeMethod',
    ],
  };

  constructor(
    // ---- ADD THIS LINE ------
    @inject(AuthenticationBindings.AUTH_ACTION)
    protected authenticateRequest: AuthenticateFn,
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,

    @inject(SequenceActions.INVOKE_MIDDLEWARE)
    readonly invokeMiddleware: InvokeMiddleware,

    readonly options: InvokeMiddlewareOptions = MiddlewareSequence.defaultOptions,
  ) { }
  async handle(context: RequestContext) {
    try {
      // debug(
      //   'Invoking middleware chain %s with groups %s',
      //   this.options.chain,
      //   this.options.orderedGroups,
      // );
      // await this.invokeMiddleware(context, this.options);
      await this.invokeMiddleware(context, this.options);
      const {request, response} = context;
      const route = this.findRoute(request);
      // - enable jwt auth -
      // call authentication action
      // ---------- ADD THIS LINE -------------
      await this.authenticateRequest(request);
      const args = await this.parseParams(request, route);
      const result = await this.invoke(route, args);
      this.send(response, result);
    } catch (err) {
      // ---------- ADD THIS SNIPPET -------------
      // if error is coming from the JWT authentication extension
      // make the statusCode 401
      if (
        err.code === AUTHENTICATION_STRATEGY_NOT_FOUND ||
        err.code === USER_PROFILE_NOT_FOUND
      ) {
        Object.assign(err, {statusCode: 401 /* Unauthorized */});
      }
      // ---------- END OF SNIPPET -------------
      this.reject(context, err);
    }
  }
}

