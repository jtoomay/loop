/**
 * @generated SignedSource<<db46f81fe6c173eabd51656bc55b00df>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type useSkipMutation$variables = {
  id: string;
  timezone: string;
};
export type useSkipMutation$data = {
  readonly skipHabit: boolean;
};
export type useSkipMutation = {
  response: useSkipMutation$data;
  variables: useSkipMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "timezone"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      },
      {
        "kind": "Variable",
        "name": "timezone",
        "variableName": "timezone"
      }
    ],
    "kind": "ScalarField",
    "name": "skipHabit",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "useSkipMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "useSkipMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "b910bdeb0ea07c6b137e3187cca15cac",
    "id": null,
    "metadata": {},
    "name": "useSkipMutation",
    "operationKind": "mutation",
    "text": "mutation useSkipMutation(\n  $id: ID!\n  $timezone: String!\n) {\n  skipHabit(id: $id, timezone: $timezone)\n}\n"
  }
};
})();

(node as any).hash = "363784d04f5f926379c157a3f0d9a3e7";

export default node;
