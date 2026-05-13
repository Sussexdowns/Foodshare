# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListFoodItems*](#listfooditems)
  - [*GetFoodItemById*](#getfooditembyid)
  - [*SearchFoodItems*](#searchfooditems)
  - [*ListFoodItemsByCategory*](#listfooditemsbycategory)
  - [*ListFoodItemsByLocation*](#listfooditemsbylocation)
  - [*ListFoodItemsInBounds*](#listfooditemsinbounds)
  - [*ListMyFoodItems*](#listmyfooditems)
  - [*ListCommunities*](#listcommunities)
  - [*GetCommunityById*](#getcommunitybyid)
  - [*ListMyRequests*](#listmyrequests)
  - [*ListUserReviews*](#listuserreviews)
- [**Mutations**](#mutations)
  - [*CreateFoodItem*](#createfooditem)
  - [*UpdateFoodItem*](#updatefooditem)
  - [*DeleteFoodItem*](#deletefooditem)
  - [*UpdateFoodItemStatus*](#updatefooditemstatus)
  - [*UpsertUser*](#upsertuser)
  - [*UpdateUserProfile*](#updateuserprofile)
  - [*CreateRequest*](#createrequest)
  - [*UpdateRequestStatus*](#updaterequeststatus)
  - [*DeleteRequest*](#deleterequest)
  - [*CreateReview*](#createreview)
  - [*CreateCommunity*](#createcommunity)
  - [*UpdateCommunity*](#updatecommunity)
  - [*DeleteCommunity*](#deletecommunity)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListFoodItems
You can execute the `ListFoodItems` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listFoodItems(options?: ExecuteQueryOptions): QueryPromise<ListFoodItemsData, undefined>;

interface ListFoodItemsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListFoodItemsData, undefined>;
}
export const listFoodItemsRef: ListFoodItemsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listFoodItems(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListFoodItemsData, undefined>;

interface ListFoodItemsRef {
  ...
  (dc: DataConnect): QueryRef<ListFoodItemsData, undefined>;
}
export const listFoodItemsRef: ListFoodItemsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listFoodItemsRef:
```typescript
const name = listFoodItemsRef.operationName;
console.log(name);
```

### Variables
The `ListFoodItems` query has no variables.
### Return Type
Recall that executing the `ListFoodItems` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListFoodItemsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListFoodItemsData {
  foodItems: ({
    id: UUIDString;
    name: string;
    description: string;
    quantity: number;
    createdAt: TimestampString;
    status: string;
    category?: string | null;
    expirationDate?: DateString | null;
    pickupInstructions?: string | null;
    imageUrl?: string | null;
    lat?: number | null;
    lng?: number | null;
    address?: string | null;
    town?: string | null;
    county?: string | null;
    postcode?: string | null;
    season?: string | null;
    originalType?: string | null;
    link?: string | null;
    likes?: number | null;
    dislikes?: number | null;
    postedBy?: {
      id: UUIDString;
      displayName: string;
    } & User_Key;
  } & FoodItem_Key)[];
}
```
### Using `ListFoodItems`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listFoodItems } from '@dataconnect/generated';


// Call the `listFoodItems()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listFoodItems();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listFoodItems(dataConnect);

console.log(data.foodItems);

// Or, you can use the `Promise` API.
listFoodItems().then((response) => {
  const data = response.data;
  console.log(data.foodItems);
});
```

### Using `ListFoodItems`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listFoodItemsRef } from '@dataconnect/generated';


// Call the `listFoodItemsRef()` function to get a reference to the query.
const ref = listFoodItemsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listFoodItemsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.foodItems);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.foodItems);
});
```

## GetFoodItemById
You can execute the `GetFoodItemById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getFoodItemById(vars: GetFoodItemByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetFoodItemByIdData, GetFoodItemByIdVariables>;

interface GetFoodItemByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetFoodItemByIdVariables): QueryRef<GetFoodItemByIdData, GetFoodItemByIdVariables>;
}
export const getFoodItemByIdRef: GetFoodItemByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getFoodItemById(dc: DataConnect, vars: GetFoodItemByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetFoodItemByIdData, GetFoodItemByIdVariables>;

interface GetFoodItemByIdRef {
  ...
  (dc: DataConnect, vars: GetFoodItemByIdVariables): QueryRef<GetFoodItemByIdData, GetFoodItemByIdVariables>;
}
export const getFoodItemByIdRef: GetFoodItemByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getFoodItemByIdRef:
```typescript
const name = getFoodItemByIdRef.operationName;
console.log(name);
```

### Variables
The `GetFoodItemById` query requires an argument of type `GetFoodItemByIdVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetFoodItemByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetFoodItemById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetFoodItemByIdData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetFoodItemByIdData {
  foodItem?: {
    id: UUIDString;
    name: string;
    description: string;
    quantity: number;
    createdAt: TimestampString;
    status: string;
    category?: string | null;
    expirationDate?: DateString | null;
    pickupInstructions?: string | null;
    imageUrl?: string | null;
    lat?: number | null;
    lng?: number | null;
    address?: string | null;
    town?: string | null;
    county?: string | null;
    postcode?: string | null;
    season?: string | null;
    originalType?: string | null;
    link?: string | null;
    likes?: number | null;
    dislikes?: number | null;
    postedBy?: {
      id: UUIDString;
      displayName: string;
      email: string;
    } & User_Key;
  } & FoodItem_Key;
}
```
### Using `GetFoodItemById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getFoodItemById, GetFoodItemByIdVariables } from '@dataconnect/generated';

// The `GetFoodItemById` query requires an argument of type `GetFoodItemByIdVariables`:
const getFoodItemByIdVars: GetFoodItemByIdVariables = {
  id: ..., 
};

// Call the `getFoodItemById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getFoodItemById(getFoodItemByIdVars);
// Variables can be defined inline as well.
const { data } = await getFoodItemById({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getFoodItemById(dataConnect, getFoodItemByIdVars);

console.log(data.foodItem);

// Or, you can use the `Promise` API.
getFoodItemById(getFoodItemByIdVars).then((response) => {
  const data = response.data;
  console.log(data.foodItem);
});
```

### Using `GetFoodItemById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getFoodItemByIdRef, GetFoodItemByIdVariables } from '@dataconnect/generated';

// The `GetFoodItemById` query requires an argument of type `GetFoodItemByIdVariables`:
const getFoodItemByIdVars: GetFoodItemByIdVariables = {
  id: ..., 
};

// Call the `getFoodItemByIdRef()` function to get a reference to the query.
const ref = getFoodItemByIdRef(getFoodItemByIdVars);
// Variables can be defined inline as well.
const ref = getFoodItemByIdRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getFoodItemByIdRef(dataConnect, getFoodItemByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.foodItem);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.foodItem);
});
```

## SearchFoodItems
You can execute the `SearchFoodItems` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
searchFoodItems(vars?: SearchFoodItemsVariables, options?: ExecuteQueryOptions): QueryPromise<SearchFoodItemsData, SearchFoodItemsVariables>;

interface SearchFoodItemsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: SearchFoodItemsVariables): QueryRef<SearchFoodItemsData, SearchFoodItemsVariables>;
}
export const searchFoodItemsRef: SearchFoodItemsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
searchFoodItems(dc: DataConnect, vars?: SearchFoodItemsVariables, options?: ExecuteQueryOptions): QueryPromise<SearchFoodItemsData, SearchFoodItemsVariables>;

interface SearchFoodItemsRef {
  ...
  (dc: DataConnect, vars?: SearchFoodItemsVariables): QueryRef<SearchFoodItemsData, SearchFoodItemsVariables>;
}
export const searchFoodItemsRef: SearchFoodItemsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the searchFoodItemsRef:
```typescript
const name = searchFoodItemsRef.operationName;
console.log(name);
```

### Variables
The `SearchFoodItems` query has an optional argument of type `SearchFoodItemsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface SearchFoodItemsVariables {
  category?: string | null;
  name?: string | null;
  status?: string | null;
}
```
### Return Type
Recall that executing the `SearchFoodItems` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `SearchFoodItemsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface SearchFoodItemsData {
  foodItems: ({
    id: UUIDString;
    name: string;
    description: string;
    quantity: number;
    category?: string | null;
    status: string;
    expirationDate?: DateString | null;
    imageUrl?: string | null;
    pickupInstructions?: string | null;
    lat?: number | null;
    lng?: number | null;
    address?: string | null;
    town?: string | null;
    county?: string | null;
    season?: string | null;
    originalType?: string | null;
    link?: string | null;
    likes?: number | null;
    dislikes?: number | null;
    postedBy?: {
      id: UUIDString;
      displayName: string;
    } & User_Key;
  } & FoodItem_Key)[];
}
```
### Using `SearchFoodItems`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, searchFoodItems, SearchFoodItemsVariables } from '@dataconnect/generated';

// The `SearchFoodItems` query has an optional argument of type `SearchFoodItemsVariables`:
const searchFoodItemsVars: SearchFoodItemsVariables = {
  category: ..., // optional
  name: ..., // optional
  status: ..., // optional
};

// Call the `searchFoodItems()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await searchFoodItems(searchFoodItemsVars);
// Variables can be defined inline as well.
const { data } = await searchFoodItems({ category: ..., name: ..., status: ..., });
// Since all variables are optional for this query, you can omit the `SearchFoodItemsVariables` argument.
const { data } = await searchFoodItems();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await searchFoodItems(dataConnect, searchFoodItemsVars);

console.log(data.foodItems);

// Or, you can use the `Promise` API.
searchFoodItems(searchFoodItemsVars).then((response) => {
  const data = response.data;
  console.log(data.foodItems);
});
```

### Using `SearchFoodItems`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, searchFoodItemsRef, SearchFoodItemsVariables } from '@dataconnect/generated';

// The `SearchFoodItems` query has an optional argument of type `SearchFoodItemsVariables`:
const searchFoodItemsVars: SearchFoodItemsVariables = {
  category: ..., // optional
  name: ..., // optional
  status: ..., // optional
};

// Call the `searchFoodItemsRef()` function to get a reference to the query.
const ref = searchFoodItemsRef(searchFoodItemsVars);
// Variables can be defined inline as well.
const ref = searchFoodItemsRef({ category: ..., name: ..., status: ..., });
// Since all variables are optional for this query, you can omit the `SearchFoodItemsVariables` argument.
const ref = searchFoodItemsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = searchFoodItemsRef(dataConnect, searchFoodItemsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.foodItems);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.foodItems);
});
```

## ListFoodItemsByCategory
You can execute the `ListFoodItemsByCategory` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listFoodItemsByCategory(vars: ListFoodItemsByCategoryVariables, options?: ExecuteQueryOptions): QueryPromise<ListFoodItemsByCategoryData, ListFoodItemsByCategoryVariables>;

interface ListFoodItemsByCategoryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListFoodItemsByCategoryVariables): QueryRef<ListFoodItemsByCategoryData, ListFoodItemsByCategoryVariables>;
}
export const listFoodItemsByCategoryRef: ListFoodItemsByCategoryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listFoodItemsByCategory(dc: DataConnect, vars: ListFoodItemsByCategoryVariables, options?: ExecuteQueryOptions): QueryPromise<ListFoodItemsByCategoryData, ListFoodItemsByCategoryVariables>;

interface ListFoodItemsByCategoryRef {
  ...
  (dc: DataConnect, vars: ListFoodItemsByCategoryVariables): QueryRef<ListFoodItemsByCategoryData, ListFoodItemsByCategoryVariables>;
}
export const listFoodItemsByCategoryRef: ListFoodItemsByCategoryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listFoodItemsByCategoryRef:
```typescript
const name = listFoodItemsByCategoryRef.operationName;
console.log(name);
```

### Variables
The `ListFoodItemsByCategory` query requires an argument of type `ListFoodItemsByCategoryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListFoodItemsByCategoryVariables {
  category: string;
}
```
### Return Type
Recall that executing the `ListFoodItemsByCategory` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListFoodItemsByCategoryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListFoodItemsByCategoryData {
  foodItems: ({
    id: UUIDString;
    name: string;
    description: string;
    quantity: number;
    status: string;
    expirationDate?: DateString | null;
    imageUrl?: string | null;
    pickupInstructions?: string | null;
    lat?: number | null;
    lng?: number | null;
    address?: string | null;
    town?: string | null;
    county?: string | null;
    season?: string | null;
    likes?: number | null;
    dislikes?: number | null;
  } & FoodItem_Key)[];
}
```
### Using `ListFoodItemsByCategory`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listFoodItemsByCategory, ListFoodItemsByCategoryVariables } from '@dataconnect/generated';

// The `ListFoodItemsByCategory` query requires an argument of type `ListFoodItemsByCategoryVariables`:
const listFoodItemsByCategoryVars: ListFoodItemsByCategoryVariables = {
  category: ..., 
};

// Call the `listFoodItemsByCategory()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listFoodItemsByCategory(listFoodItemsByCategoryVars);
// Variables can be defined inline as well.
const { data } = await listFoodItemsByCategory({ category: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listFoodItemsByCategory(dataConnect, listFoodItemsByCategoryVars);

console.log(data.foodItems);

// Or, you can use the `Promise` API.
listFoodItemsByCategory(listFoodItemsByCategoryVars).then((response) => {
  const data = response.data;
  console.log(data.foodItems);
});
```

### Using `ListFoodItemsByCategory`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listFoodItemsByCategoryRef, ListFoodItemsByCategoryVariables } from '@dataconnect/generated';

// The `ListFoodItemsByCategory` query requires an argument of type `ListFoodItemsByCategoryVariables`:
const listFoodItemsByCategoryVars: ListFoodItemsByCategoryVariables = {
  category: ..., 
};

// Call the `listFoodItemsByCategoryRef()` function to get a reference to the query.
const ref = listFoodItemsByCategoryRef(listFoodItemsByCategoryVars);
// Variables can be defined inline as well.
const ref = listFoodItemsByCategoryRef({ category: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listFoodItemsByCategoryRef(dataConnect, listFoodItemsByCategoryVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.foodItems);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.foodItems);
});
```

## ListFoodItemsByLocation
You can execute the `ListFoodItemsByLocation` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listFoodItemsByLocation(vars?: ListFoodItemsByLocationVariables, options?: ExecuteQueryOptions): QueryPromise<ListFoodItemsByLocationData, ListFoodItemsByLocationVariables>;

interface ListFoodItemsByLocationRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListFoodItemsByLocationVariables): QueryRef<ListFoodItemsByLocationData, ListFoodItemsByLocationVariables>;
}
export const listFoodItemsByLocationRef: ListFoodItemsByLocationRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listFoodItemsByLocation(dc: DataConnect, vars?: ListFoodItemsByLocationVariables, options?: ExecuteQueryOptions): QueryPromise<ListFoodItemsByLocationData, ListFoodItemsByLocationVariables>;

interface ListFoodItemsByLocationRef {
  ...
  (dc: DataConnect, vars?: ListFoodItemsByLocationVariables): QueryRef<ListFoodItemsByLocationData, ListFoodItemsByLocationVariables>;
}
export const listFoodItemsByLocationRef: ListFoodItemsByLocationRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listFoodItemsByLocationRef:
```typescript
const name = listFoodItemsByLocationRef.operationName;
console.log(name);
```

### Variables
The `ListFoodItemsByLocation` query has an optional argument of type `ListFoodItemsByLocationVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListFoodItemsByLocationVariables {
  town?: string | null;
  county?: string | null;
}
```
### Return Type
Recall that executing the `ListFoodItemsByLocation` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListFoodItemsByLocationData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListFoodItemsByLocationData {
  foodItems: ({
    id: UUIDString;
    name: string;
    description: string;
    quantity: number;
    status: string;
    category?: string | null;
    expirationDate?: DateString | null;
    imageUrl?: string | null;
    pickupInstructions?: string | null;
    lat?: number | null;
    lng?: number | null;
    address?: string | null;
    town?: string | null;
    county?: string | null;
    season?: string | null;
    likes?: number | null;
    dislikes?: number | null;
    postedBy?: {
      id: UUIDString;
      displayName: string;
    } & User_Key;
  } & FoodItem_Key)[];
}
```
### Using `ListFoodItemsByLocation`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listFoodItemsByLocation, ListFoodItemsByLocationVariables } from '@dataconnect/generated';

// The `ListFoodItemsByLocation` query has an optional argument of type `ListFoodItemsByLocationVariables`:
const listFoodItemsByLocationVars: ListFoodItemsByLocationVariables = {
  town: ..., // optional
  county: ..., // optional
};

// Call the `listFoodItemsByLocation()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listFoodItemsByLocation(listFoodItemsByLocationVars);
// Variables can be defined inline as well.
const { data } = await listFoodItemsByLocation({ town: ..., county: ..., });
// Since all variables are optional for this query, you can omit the `ListFoodItemsByLocationVariables` argument.
const { data } = await listFoodItemsByLocation();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listFoodItemsByLocation(dataConnect, listFoodItemsByLocationVars);

console.log(data.foodItems);

// Or, you can use the `Promise` API.
listFoodItemsByLocation(listFoodItemsByLocationVars).then((response) => {
  const data = response.data;
  console.log(data.foodItems);
});
```

### Using `ListFoodItemsByLocation`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listFoodItemsByLocationRef, ListFoodItemsByLocationVariables } from '@dataconnect/generated';

// The `ListFoodItemsByLocation` query has an optional argument of type `ListFoodItemsByLocationVariables`:
const listFoodItemsByLocationVars: ListFoodItemsByLocationVariables = {
  town: ..., // optional
  county: ..., // optional
};

// Call the `listFoodItemsByLocationRef()` function to get a reference to the query.
const ref = listFoodItemsByLocationRef(listFoodItemsByLocationVars);
// Variables can be defined inline as well.
const ref = listFoodItemsByLocationRef({ town: ..., county: ..., });
// Since all variables are optional for this query, you can omit the `ListFoodItemsByLocationVariables` argument.
const ref = listFoodItemsByLocationRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listFoodItemsByLocationRef(dataConnect, listFoodItemsByLocationVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.foodItems);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.foodItems);
});
```

## ListFoodItemsInBounds
You can execute the `ListFoodItemsInBounds` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listFoodItemsInBounds(vars: ListFoodItemsInBoundsVariables, options?: ExecuteQueryOptions): QueryPromise<ListFoodItemsInBoundsData, ListFoodItemsInBoundsVariables>;

interface ListFoodItemsInBoundsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListFoodItemsInBoundsVariables): QueryRef<ListFoodItemsInBoundsData, ListFoodItemsInBoundsVariables>;
}
export const listFoodItemsInBoundsRef: ListFoodItemsInBoundsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listFoodItemsInBounds(dc: DataConnect, vars: ListFoodItemsInBoundsVariables, options?: ExecuteQueryOptions): QueryPromise<ListFoodItemsInBoundsData, ListFoodItemsInBoundsVariables>;

interface ListFoodItemsInBoundsRef {
  ...
  (dc: DataConnect, vars: ListFoodItemsInBoundsVariables): QueryRef<ListFoodItemsInBoundsData, ListFoodItemsInBoundsVariables>;
}
export const listFoodItemsInBoundsRef: ListFoodItemsInBoundsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listFoodItemsInBoundsRef:
```typescript
const name = listFoodItemsInBoundsRef.operationName;
console.log(name);
```

### Variables
The `ListFoodItemsInBounds` query requires an argument of type `ListFoodItemsInBoundsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListFoodItemsInBoundsVariables {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}
```
### Return Type
Recall that executing the `ListFoodItemsInBounds` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListFoodItemsInBoundsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListFoodItemsInBoundsData {
  foodItems: ({
    id: UUIDString;
    name: string;
    description: string;
    quantity: number;
    status: string;
    category?: string | null;
    lat?: number | null;
    lng?: number | null;
    address?: string | null;
    town?: string | null;
    county?: string | null;
    imageUrl?: string | null;
    season?: string | null;
    likes?: number | null;
    dislikes?: number | null;
    postedBy?: {
      id: UUIDString;
      displayName: string;
    } & User_Key;
  } & FoodItem_Key)[];
}
```
### Using `ListFoodItemsInBounds`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listFoodItemsInBounds, ListFoodItemsInBoundsVariables } from '@dataconnect/generated';

// The `ListFoodItemsInBounds` query requires an argument of type `ListFoodItemsInBoundsVariables`:
const listFoodItemsInBoundsVars: ListFoodItemsInBoundsVariables = {
  minLat: ..., 
  maxLat: ..., 
  minLng: ..., 
  maxLng: ..., 
};

// Call the `listFoodItemsInBounds()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listFoodItemsInBounds(listFoodItemsInBoundsVars);
// Variables can be defined inline as well.
const { data } = await listFoodItemsInBounds({ minLat: ..., maxLat: ..., minLng: ..., maxLng: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listFoodItemsInBounds(dataConnect, listFoodItemsInBoundsVars);

console.log(data.foodItems);

// Or, you can use the `Promise` API.
listFoodItemsInBounds(listFoodItemsInBoundsVars).then((response) => {
  const data = response.data;
  console.log(data.foodItems);
});
```

### Using `ListFoodItemsInBounds`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listFoodItemsInBoundsRef, ListFoodItemsInBoundsVariables } from '@dataconnect/generated';

// The `ListFoodItemsInBounds` query requires an argument of type `ListFoodItemsInBoundsVariables`:
const listFoodItemsInBoundsVars: ListFoodItemsInBoundsVariables = {
  minLat: ..., 
  maxLat: ..., 
  minLng: ..., 
  maxLng: ..., 
};

// Call the `listFoodItemsInBoundsRef()` function to get a reference to the query.
const ref = listFoodItemsInBoundsRef(listFoodItemsInBoundsVars);
// Variables can be defined inline as well.
const ref = listFoodItemsInBoundsRef({ minLat: ..., maxLat: ..., minLng: ..., maxLng: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listFoodItemsInBoundsRef(dataConnect, listFoodItemsInBoundsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.foodItems);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.foodItems);
});
```

## ListMyFoodItems
You can execute the `ListMyFoodItems` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listMyFoodItems(options?: ExecuteQueryOptions): QueryPromise<ListMyFoodItemsData, undefined>;

interface ListMyFoodItemsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyFoodItemsData, undefined>;
}
export const listMyFoodItemsRef: ListMyFoodItemsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMyFoodItems(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyFoodItemsData, undefined>;

interface ListMyFoodItemsRef {
  ...
  (dc: DataConnect): QueryRef<ListMyFoodItemsData, undefined>;
}
export const listMyFoodItemsRef: ListMyFoodItemsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMyFoodItemsRef:
```typescript
const name = listMyFoodItemsRef.operationName;
console.log(name);
```

### Variables
The `ListMyFoodItems` query has no variables.
### Return Type
Recall that executing the `ListMyFoodItems` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMyFoodItemsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListMyFoodItemsData {
  user?: {
    id: UUIDString;
    displayName: string;
    foodItems: ({
      id: UUIDString;
      name: string;
      description: string;
      quantity: number;
      status: string;
      category?: string | null;
      expirationDate?: DateString | null;
      imageUrl?: string | null;
      createdAt: TimestampString;
      lat?: number | null;
      lng?: number | null;
      address?: string | null;
      town?: string | null;
      county?: string | null;
      season?: string | null;
      likes?: number | null;
      dislikes?: number | null;
    } & FoodItem_Key)[];
  } & User_Key;
}
```
### Using `ListMyFoodItems`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMyFoodItems } from '@dataconnect/generated';


// Call the `listMyFoodItems()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMyFoodItems();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMyFoodItems(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
listMyFoodItems().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `ListMyFoodItems`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMyFoodItemsRef } from '@dataconnect/generated';


// Call the `listMyFoodItemsRef()` function to get a reference to the query.
const ref = listMyFoodItemsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMyFoodItemsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## ListCommunities
You can execute the `ListCommunities` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listCommunities(options?: ExecuteQueryOptions): QueryPromise<ListCommunitiesData, undefined>;

interface ListCommunitiesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListCommunitiesData, undefined>;
}
export const listCommunitiesRef: ListCommunitiesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listCommunities(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListCommunitiesData, undefined>;

interface ListCommunitiesRef {
  ...
  (dc: DataConnect): QueryRef<ListCommunitiesData, undefined>;
}
export const listCommunitiesRef: ListCommunitiesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listCommunitiesRef:
```typescript
const name = listCommunitiesRef.operationName;
console.log(name);
```

### Variables
The `ListCommunities` query has no variables.
### Return Type
Recall that executing the `ListCommunities` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListCommunitiesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListCommunitiesData {
  communities: ({
    id: UUIDString;
    name: string;
    location: string;
    description?: string | null;
    createdAt: TimestampString;
    moderator?: {
      id: UUIDString;
      displayName: string;
    } & User_Key;
  } & Community_Key)[];
}
```
### Using `ListCommunities`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listCommunities } from '@dataconnect/generated';


// Call the `listCommunities()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listCommunities();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listCommunities(dataConnect);

console.log(data.communities);

// Or, you can use the `Promise` API.
listCommunities().then((response) => {
  const data = response.data;
  console.log(data.communities);
});
```

### Using `ListCommunities`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listCommunitiesRef } from '@dataconnect/generated';


// Call the `listCommunitiesRef()` function to get a reference to the query.
const ref = listCommunitiesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listCommunitiesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.communities);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.communities);
});
```

## GetCommunityById
You can execute the `GetCommunityById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getCommunityById(vars: GetCommunityByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetCommunityByIdData, GetCommunityByIdVariables>;

interface GetCommunityByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCommunityByIdVariables): QueryRef<GetCommunityByIdData, GetCommunityByIdVariables>;
}
export const getCommunityByIdRef: GetCommunityByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCommunityById(dc: DataConnect, vars: GetCommunityByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetCommunityByIdData, GetCommunityByIdVariables>;

interface GetCommunityByIdRef {
  ...
  (dc: DataConnect, vars: GetCommunityByIdVariables): QueryRef<GetCommunityByIdData, GetCommunityByIdVariables>;
}
export const getCommunityByIdRef: GetCommunityByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCommunityByIdRef:
```typescript
const name = getCommunityByIdRef.operationName;
console.log(name);
```

### Variables
The `GetCommunityById` query requires an argument of type `GetCommunityByIdVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetCommunityByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetCommunityById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCommunityByIdData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetCommunityByIdData {
  community?: {
    id: UUIDString;
    name: string;
    location: string;
    description?: string | null;
    createdAt: TimestampString;
    moderator?: {
      id: UUIDString;
      displayName: string;
    } & User_Key;
  } & Community_Key;
}
```
### Using `GetCommunityById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCommunityById, GetCommunityByIdVariables } from '@dataconnect/generated';

// The `GetCommunityById` query requires an argument of type `GetCommunityByIdVariables`:
const getCommunityByIdVars: GetCommunityByIdVariables = {
  id: ..., 
};

// Call the `getCommunityById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCommunityById(getCommunityByIdVars);
// Variables can be defined inline as well.
const { data } = await getCommunityById({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCommunityById(dataConnect, getCommunityByIdVars);

console.log(data.community);

// Or, you can use the `Promise` API.
getCommunityById(getCommunityByIdVars).then((response) => {
  const data = response.data;
  console.log(data.community);
});
```

### Using `GetCommunityById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCommunityByIdRef, GetCommunityByIdVariables } from '@dataconnect/generated';

// The `GetCommunityById` query requires an argument of type `GetCommunityByIdVariables`:
const getCommunityByIdVars: GetCommunityByIdVariables = {
  id: ..., 
};

// Call the `getCommunityByIdRef()` function to get a reference to the query.
const ref = getCommunityByIdRef(getCommunityByIdVars);
// Variables can be defined inline as well.
const ref = getCommunityByIdRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCommunityByIdRef(dataConnect, getCommunityByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.community);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.community);
});
```

## ListMyRequests
You can execute the `ListMyRequests` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listMyRequests(options?: ExecuteQueryOptions): QueryPromise<ListMyRequestsData, undefined>;

interface ListMyRequestsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyRequestsData, undefined>;
}
export const listMyRequestsRef: ListMyRequestsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMyRequests(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyRequestsData, undefined>;

interface ListMyRequestsRef {
  ...
  (dc: DataConnect): QueryRef<ListMyRequestsData, undefined>;
}
export const listMyRequestsRef: ListMyRequestsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMyRequestsRef:
```typescript
const name = listMyRequestsRef.operationName;
console.log(name);
```

### Variables
The `ListMyRequests` query has no variables.
### Return Type
Recall that executing the `ListMyRequests` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMyRequestsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListMyRequestsData {
  user?: {
    id: UUIDString;
    displayName: string;
    requests: ({
      id: UUIDString;
      status: string;
      messageToDonor?: string | null;
      createdAt: TimestampString;
      foodItem?: {
        id: UUIDString;
        name: string;
        description: string;
        imageUrl?: string | null;
        lat?: number | null;
        lng?: number | null;
        address?: string | null;
        postedBy?: {
          id: UUIDString;
          displayName: string;
        } & User_Key;
      } & FoodItem_Key;
    } & Request_Key)[];
  } & User_Key;
}
```
### Using `ListMyRequests`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMyRequests } from '@dataconnect/generated';


// Call the `listMyRequests()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMyRequests();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMyRequests(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
listMyRequests().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `ListMyRequests`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMyRequestsRef } from '@dataconnect/generated';


// Call the `listMyRequestsRef()` function to get a reference to the query.
const ref = listMyRequestsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMyRequestsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## ListUserReviews
You can execute the `ListUserReviews` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listUserReviews(vars: ListUserReviewsVariables, options?: ExecuteQueryOptions): QueryPromise<ListUserReviewsData, ListUserReviewsVariables>;

interface ListUserReviewsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListUserReviewsVariables): QueryRef<ListUserReviewsData, ListUserReviewsVariables>;
}
export const listUserReviewsRef: ListUserReviewsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listUserReviews(dc: DataConnect, vars: ListUserReviewsVariables, options?: ExecuteQueryOptions): QueryPromise<ListUserReviewsData, ListUserReviewsVariables>;

interface ListUserReviewsRef {
  ...
  (dc: DataConnect, vars: ListUserReviewsVariables): QueryRef<ListUserReviewsData, ListUserReviewsVariables>;
}
export const listUserReviewsRef: ListUserReviewsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listUserReviewsRef:
```typescript
const name = listUserReviewsRef.operationName;
console.log(name);
```

### Variables
The `ListUserReviews` query requires an argument of type `ListUserReviewsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListUserReviewsVariables {
  userId: UUIDString;
}
```
### Return Type
Recall that executing the `ListUserReviews` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListUserReviewsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListUserReviewsData {
  reviews: ({
    id: UUIDString;
    rating: number;
    comment?: string | null;
    createdAt: TimestampString;
    reviewer?: {
      id: UUIDString;
      displayName: string;
    } & User_Key;
  } & Review_Key)[];
}
```
### Using `ListUserReviews`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listUserReviews, ListUserReviewsVariables } from '@dataconnect/generated';

// The `ListUserReviews` query requires an argument of type `ListUserReviewsVariables`:
const listUserReviewsVars: ListUserReviewsVariables = {
  userId: ..., 
};

// Call the `listUserReviews()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listUserReviews(listUserReviewsVars);
// Variables can be defined inline as well.
const { data } = await listUserReviews({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listUserReviews(dataConnect, listUserReviewsVars);

console.log(data.reviews);

// Or, you can use the `Promise` API.
listUserReviews(listUserReviewsVars).then((response) => {
  const data = response.data;
  console.log(data.reviews);
});
```

### Using `ListUserReviews`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listUserReviewsRef, ListUserReviewsVariables } from '@dataconnect/generated';

// The `ListUserReviews` query requires an argument of type `ListUserReviewsVariables`:
const listUserReviewsVars: ListUserReviewsVariables = {
  userId: ..., 
};

// Call the `listUserReviewsRef()` function to get a reference to the query.
const ref = listUserReviewsRef(listUserReviewsVars);
// Variables can be defined inline as well.
const ref = listUserReviewsRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listUserReviewsRef(dataConnect, listUserReviewsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.reviews);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.reviews);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateFoodItem
You can execute the `CreateFoodItem` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createFoodItem(vars: CreateFoodItemVariables): MutationPromise<CreateFoodItemData, CreateFoodItemVariables>;

interface CreateFoodItemRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateFoodItemVariables): MutationRef<CreateFoodItemData, CreateFoodItemVariables>;
}
export const createFoodItemRef: CreateFoodItemRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createFoodItem(dc: DataConnect, vars: CreateFoodItemVariables): MutationPromise<CreateFoodItemData, CreateFoodItemVariables>;

interface CreateFoodItemRef {
  ...
  (dc: DataConnect, vars: CreateFoodItemVariables): MutationRef<CreateFoodItemData, CreateFoodItemVariables>;
}
export const createFoodItemRef: CreateFoodItemRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createFoodItemRef:
```typescript
const name = createFoodItemRef.operationName;
console.log(name);
```

### Variables
The `CreateFoodItem` mutation requires an argument of type `CreateFoodItemVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateFoodItemVariables {
  name: string;
  description: string;
  quantity: number;
  category?: string | null;
  expirationDate?: DateString | null;
  pickupInstructions?: string | null;
  imageUrl?: string | null;
  lat?: number | null;
  lng?: number | null;
  address?: string | null;
  town?: string | null;
  county?: string | null;
  postcode?: string | null;
  season?: string | null;
  originalType?: string | null;
  link?: string | null;
}
```
### Return Type
Recall that executing the `CreateFoodItem` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateFoodItemData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateFoodItemData {
  foodItem_insert: FoodItem_Key;
}
```
### Using `CreateFoodItem`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createFoodItem, CreateFoodItemVariables } from '@dataconnect/generated';

// The `CreateFoodItem` mutation requires an argument of type `CreateFoodItemVariables`:
const createFoodItemVars: CreateFoodItemVariables = {
  name: ..., 
  description: ..., 
  quantity: ..., 
  category: ..., // optional
  expirationDate: ..., // optional
  pickupInstructions: ..., // optional
  imageUrl: ..., // optional
  lat: ..., // optional
  lng: ..., // optional
  address: ..., // optional
  town: ..., // optional
  county: ..., // optional
  postcode: ..., // optional
  season: ..., // optional
  originalType: ..., // optional
  link: ..., // optional
};

// Call the `createFoodItem()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createFoodItem(createFoodItemVars);
// Variables can be defined inline as well.
const { data } = await createFoodItem({ name: ..., description: ..., quantity: ..., category: ..., expirationDate: ..., pickupInstructions: ..., imageUrl: ..., lat: ..., lng: ..., address: ..., town: ..., county: ..., postcode: ..., season: ..., originalType: ..., link: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createFoodItem(dataConnect, createFoodItemVars);

console.log(data.foodItem_insert);

// Or, you can use the `Promise` API.
createFoodItem(createFoodItemVars).then((response) => {
  const data = response.data;
  console.log(data.foodItem_insert);
});
```

### Using `CreateFoodItem`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createFoodItemRef, CreateFoodItemVariables } from '@dataconnect/generated';

// The `CreateFoodItem` mutation requires an argument of type `CreateFoodItemVariables`:
const createFoodItemVars: CreateFoodItemVariables = {
  name: ..., 
  description: ..., 
  quantity: ..., 
  category: ..., // optional
  expirationDate: ..., // optional
  pickupInstructions: ..., // optional
  imageUrl: ..., // optional
  lat: ..., // optional
  lng: ..., // optional
  address: ..., // optional
  town: ..., // optional
  county: ..., // optional
  postcode: ..., // optional
  season: ..., // optional
  originalType: ..., // optional
  link: ..., // optional
};

// Call the `createFoodItemRef()` function to get a reference to the mutation.
const ref = createFoodItemRef(createFoodItemVars);
// Variables can be defined inline as well.
const ref = createFoodItemRef({ name: ..., description: ..., quantity: ..., category: ..., expirationDate: ..., pickupInstructions: ..., imageUrl: ..., lat: ..., lng: ..., address: ..., town: ..., county: ..., postcode: ..., season: ..., originalType: ..., link: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createFoodItemRef(dataConnect, createFoodItemVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.foodItem_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.foodItem_insert);
});
```

## UpdateFoodItem
You can execute the `UpdateFoodItem` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateFoodItem(vars: UpdateFoodItemVariables): MutationPromise<UpdateFoodItemData, UpdateFoodItemVariables>;

interface UpdateFoodItemRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateFoodItemVariables): MutationRef<UpdateFoodItemData, UpdateFoodItemVariables>;
}
export const updateFoodItemRef: UpdateFoodItemRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateFoodItem(dc: DataConnect, vars: UpdateFoodItemVariables): MutationPromise<UpdateFoodItemData, UpdateFoodItemVariables>;

interface UpdateFoodItemRef {
  ...
  (dc: DataConnect, vars: UpdateFoodItemVariables): MutationRef<UpdateFoodItemData, UpdateFoodItemVariables>;
}
export const updateFoodItemRef: UpdateFoodItemRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateFoodItemRef:
```typescript
const name = updateFoodItemRef.operationName;
console.log(name);
```

### Variables
The `UpdateFoodItem` mutation requires an argument of type `UpdateFoodItemVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateFoodItemVariables {
  id: UUIDString;
  name?: string | null;
  description?: string | null;
  quantity?: number | null;
  category?: string | null;
  status?: string | null;
  expirationDate?: DateString | null;
  pickupInstructions?: string | null;
  imageUrl?: string | null;
  lat?: number | null;
  lng?: number | null;
  address?: string | null;
  town?: string | null;
  county?: string | null;
  postcode?: string | null;
  season?: string | null;
  originalType?: string | null;
  link?: string | null;
}
```
### Return Type
Recall that executing the `UpdateFoodItem` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateFoodItemData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateFoodItemData {
  foodItem_update?: FoodItem_Key | null;
}
```
### Using `UpdateFoodItem`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateFoodItem, UpdateFoodItemVariables } from '@dataconnect/generated';

// The `UpdateFoodItem` mutation requires an argument of type `UpdateFoodItemVariables`:
const updateFoodItemVars: UpdateFoodItemVariables = {
  id: ..., 
  name: ..., // optional
  description: ..., // optional
  quantity: ..., // optional
  category: ..., // optional
  status: ..., // optional
  expirationDate: ..., // optional
  pickupInstructions: ..., // optional
  imageUrl: ..., // optional
  lat: ..., // optional
  lng: ..., // optional
  address: ..., // optional
  town: ..., // optional
  county: ..., // optional
  postcode: ..., // optional
  season: ..., // optional
  originalType: ..., // optional
  link: ..., // optional
};

// Call the `updateFoodItem()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateFoodItem(updateFoodItemVars);
// Variables can be defined inline as well.
const { data } = await updateFoodItem({ id: ..., name: ..., description: ..., quantity: ..., category: ..., status: ..., expirationDate: ..., pickupInstructions: ..., imageUrl: ..., lat: ..., lng: ..., address: ..., town: ..., county: ..., postcode: ..., season: ..., originalType: ..., link: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateFoodItem(dataConnect, updateFoodItemVars);

console.log(data.foodItem_update);

// Or, you can use the `Promise` API.
updateFoodItem(updateFoodItemVars).then((response) => {
  const data = response.data;
  console.log(data.foodItem_update);
});
```

### Using `UpdateFoodItem`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateFoodItemRef, UpdateFoodItemVariables } from '@dataconnect/generated';

// The `UpdateFoodItem` mutation requires an argument of type `UpdateFoodItemVariables`:
const updateFoodItemVars: UpdateFoodItemVariables = {
  id: ..., 
  name: ..., // optional
  description: ..., // optional
  quantity: ..., // optional
  category: ..., // optional
  status: ..., // optional
  expirationDate: ..., // optional
  pickupInstructions: ..., // optional
  imageUrl: ..., // optional
  lat: ..., // optional
  lng: ..., // optional
  address: ..., // optional
  town: ..., // optional
  county: ..., // optional
  postcode: ..., // optional
  season: ..., // optional
  originalType: ..., // optional
  link: ..., // optional
};

// Call the `updateFoodItemRef()` function to get a reference to the mutation.
const ref = updateFoodItemRef(updateFoodItemVars);
// Variables can be defined inline as well.
const ref = updateFoodItemRef({ id: ..., name: ..., description: ..., quantity: ..., category: ..., status: ..., expirationDate: ..., pickupInstructions: ..., imageUrl: ..., lat: ..., lng: ..., address: ..., town: ..., county: ..., postcode: ..., season: ..., originalType: ..., link: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateFoodItemRef(dataConnect, updateFoodItemVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.foodItem_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.foodItem_update);
});
```

## DeleteFoodItem
You can execute the `DeleteFoodItem` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteFoodItem(vars: DeleteFoodItemVariables): MutationPromise<DeleteFoodItemData, DeleteFoodItemVariables>;

interface DeleteFoodItemRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteFoodItemVariables): MutationRef<DeleteFoodItemData, DeleteFoodItemVariables>;
}
export const deleteFoodItemRef: DeleteFoodItemRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteFoodItem(dc: DataConnect, vars: DeleteFoodItemVariables): MutationPromise<DeleteFoodItemData, DeleteFoodItemVariables>;

interface DeleteFoodItemRef {
  ...
  (dc: DataConnect, vars: DeleteFoodItemVariables): MutationRef<DeleteFoodItemData, DeleteFoodItemVariables>;
}
export const deleteFoodItemRef: DeleteFoodItemRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteFoodItemRef:
```typescript
const name = deleteFoodItemRef.operationName;
console.log(name);
```

### Variables
The `DeleteFoodItem` mutation requires an argument of type `DeleteFoodItemVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteFoodItemVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteFoodItem` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteFoodItemData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteFoodItemData {
  foodItem_delete?: FoodItem_Key | null;
}
```
### Using `DeleteFoodItem`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteFoodItem, DeleteFoodItemVariables } from '@dataconnect/generated';

// The `DeleteFoodItem` mutation requires an argument of type `DeleteFoodItemVariables`:
const deleteFoodItemVars: DeleteFoodItemVariables = {
  id: ..., 
};

// Call the `deleteFoodItem()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteFoodItem(deleteFoodItemVars);
// Variables can be defined inline as well.
const { data } = await deleteFoodItem({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteFoodItem(dataConnect, deleteFoodItemVars);

console.log(data.foodItem_delete);

// Or, you can use the `Promise` API.
deleteFoodItem(deleteFoodItemVars).then((response) => {
  const data = response.data;
  console.log(data.foodItem_delete);
});
```

### Using `DeleteFoodItem`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteFoodItemRef, DeleteFoodItemVariables } from '@dataconnect/generated';

// The `DeleteFoodItem` mutation requires an argument of type `DeleteFoodItemVariables`:
const deleteFoodItemVars: DeleteFoodItemVariables = {
  id: ..., 
};

// Call the `deleteFoodItemRef()` function to get a reference to the mutation.
const ref = deleteFoodItemRef(deleteFoodItemVars);
// Variables can be defined inline as well.
const ref = deleteFoodItemRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteFoodItemRef(dataConnect, deleteFoodItemVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.foodItem_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.foodItem_delete);
});
```

## UpdateFoodItemStatus
You can execute the `UpdateFoodItemStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateFoodItemStatus(vars: UpdateFoodItemStatusVariables): MutationPromise<UpdateFoodItemStatusData, UpdateFoodItemStatusVariables>;

interface UpdateFoodItemStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateFoodItemStatusVariables): MutationRef<UpdateFoodItemStatusData, UpdateFoodItemStatusVariables>;
}
export const updateFoodItemStatusRef: UpdateFoodItemStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateFoodItemStatus(dc: DataConnect, vars: UpdateFoodItemStatusVariables): MutationPromise<UpdateFoodItemStatusData, UpdateFoodItemStatusVariables>;

interface UpdateFoodItemStatusRef {
  ...
  (dc: DataConnect, vars: UpdateFoodItemStatusVariables): MutationRef<UpdateFoodItemStatusData, UpdateFoodItemStatusVariables>;
}
export const updateFoodItemStatusRef: UpdateFoodItemStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateFoodItemStatusRef:
```typescript
const name = updateFoodItemStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateFoodItemStatus` mutation requires an argument of type `UpdateFoodItemStatusVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateFoodItemStatusVariables {
  id: UUIDString;
  status: string;
}
```
### Return Type
Recall that executing the `UpdateFoodItemStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateFoodItemStatusData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateFoodItemStatusData {
  foodItem_update?: FoodItem_Key | null;
}
```
### Using `UpdateFoodItemStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateFoodItemStatus, UpdateFoodItemStatusVariables } from '@dataconnect/generated';

// The `UpdateFoodItemStatus` mutation requires an argument of type `UpdateFoodItemStatusVariables`:
const updateFoodItemStatusVars: UpdateFoodItemStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateFoodItemStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateFoodItemStatus(updateFoodItemStatusVars);
// Variables can be defined inline as well.
const { data } = await updateFoodItemStatus({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateFoodItemStatus(dataConnect, updateFoodItemStatusVars);

console.log(data.foodItem_update);

// Or, you can use the `Promise` API.
updateFoodItemStatus(updateFoodItemStatusVars).then((response) => {
  const data = response.data;
  console.log(data.foodItem_update);
});
```

### Using `UpdateFoodItemStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateFoodItemStatusRef, UpdateFoodItemStatusVariables } from '@dataconnect/generated';

// The `UpdateFoodItemStatus` mutation requires an argument of type `UpdateFoodItemStatusVariables`:
const updateFoodItemStatusVars: UpdateFoodItemStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateFoodItemStatusRef()` function to get a reference to the mutation.
const ref = updateFoodItemStatusRef(updateFoodItemStatusVars);
// Variables can be defined inline as well.
const ref = updateFoodItemStatusRef({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateFoodItemStatusRef(dataConnect, updateFoodItemStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.foodItem_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.foodItem_update);
});
```

## UpsertUser
You can execute the `UpsertUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertUser(vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;

interface UpsertUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
}
export const upsertUserRef: UpsertUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertUser(dc: DataConnect, vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;

interface UpsertUserRef {
  ...
  (dc: DataConnect, vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
}
export const upsertUserRef: UpsertUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertUserRef:
```typescript
const name = upsertUserRef.operationName;
console.log(name);
```

### Variables
The `UpsertUser` mutation requires an argument of type `UpsertUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertUserVariables {
  displayName: string;
  email: string;
  userType: string;
  phoneNumber?: string | null;
  address?: string | null;
  bio?: string | null;
  profilePictureUrl?: string | null;
}
```
### Return Type
Recall that executing the `UpsertUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertUserData {
  user_upsert: User_Key;
}
```
### Using `UpsertUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertUser, UpsertUserVariables } from '@dataconnect/generated';

// The `UpsertUser` mutation requires an argument of type `UpsertUserVariables`:
const upsertUserVars: UpsertUserVariables = {
  displayName: ..., 
  email: ..., 
  userType: ..., 
  phoneNumber: ..., // optional
  address: ..., // optional
  bio: ..., // optional
  profilePictureUrl: ..., // optional
};

// Call the `upsertUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertUser(upsertUserVars);
// Variables can be defined inline as well.
const { data } = await upsertUser({ displayName: ..., email: ..., userType: ..., phoneNumber: ..., address: ..., bio: ..., profilePictureUrl: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertUser(dataConnect, upsertUserVars);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
upsertUser(upsertUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

### Using `UpsertUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertUserRef, UpsertUserVariables } from '@dataconnect/generated';

// The `UpsertUser` mutation requires an argument of type `UpsertUserVariables`:
const upsertUserVars: UpsertUserVariables = {
  displayName: ..., 
  email: ..., 
  userType: ..., 
  phoneNumber: ..., // optional
  address: ..., // optional
  bio: ..., // optional
  profilePictureUrl: ..., // optional
};

// Call the `upsertUserRef()` function to get a reference to the mutation.
const ref = upsertUserRef(upsertUserVars);
// Variables can be defined inline as well.
const ref = upsertUserRef({ displayName: ..., email: ..., userType: ..., phoneNumber: ..., address: ..., bio: ..., profilePictureUrl: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertUserRef(dataConnect, upsertUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

## UpdateUserProfile
You can execute the `UpdateUserProfile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateUserProfile(vars?: UpdateUserProfileVariables): MutationPromise<UpdateUserProfileData, UpdateUserProfileVariables>;

interface UpdateUserProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpdateUserProfileVariables): MutationRef<UpdateUserProfileData, UpdateUserProfileVariables>;
}
export const updateUserProfileRef: UpdateUserProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUserProfile(dc: DataConnect, vars?: UpdateUserProfileVariables): MutationPromise<UpdateUserProfileData, UpdateUserProfileVariables>;

interface UpdateUserProfileRef {
  ...
  (dc: DataConnect, vars?: UpdateUserProfileVariables): MutationRef<UpdateUserProfileData, UpdateUserProfileVariables>;
}
export const updateUserProfileRef: UpdateUserProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserProfileRef:
```typescript
const name = updateUserProfileRef.operationName;
console.log(name);
```

### Variables
The `UpdateUserProfile` mutation has an optional argument of type `UpdateUserProfileVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateUserProfileVariables {
  displayName?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  bio?: string | null;
  profilePictureUrl?: string | null;
}
```
### Return Type
Recall that executing the `UpdateUserProfile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserProfileData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserProfileData {
  user_update?: User_Key | null;
}
```
### Using `UpdateUserProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUserProfile, UpdateUserProfileVariables } from '@dataconnect/generated';

// The `UpdateUserProfile` mutation has an optional argument of type `UpdateUserProfileVariables`:
const updateUserProfileVars: UpdateUserProfileVariables = {
  displayName: ..., // optional
  phoneNumber: ..., // optional
  address: ..., // optional
  bio: ..., // optional
  profilePictureUrl: ..., // optional
};

// Call the `updateUserProfile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUserProfile(updateUserProfileVars);
// Variables can be defined inline as well.
const { data } = await updateUserProfile({ displayName: ..., phoneNumber: ..., address: ..., bio: ..., profilePictureUrl: ..., });
// Since all variables are optional for this mutation, you can omit the `UpdateUserProfileVariables` argument.
const { data } = await updateUserProfile();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUserProfile(dataConnect, updateUserProfileVars);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateUserProfile(updateUserProfileVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateUserProfile`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserProfileRef, UpdateUserProfileVariables } from '@dataconnect/generated';

// The `UpdateUserProfile` mutation has an optional argument of type `UpdateUserProfileVariables`:
const updateUserProfileVars: UpdateUserProfileVariables = {
  displayName: ..., // optional
  phoneNumber: ..., // optional
  address: ..., // optional
  bio: ..., // optional
  profilePictureUrl: ..., // optional
};

// Call the `updateUserProfileRef()` function to get a reference to the mutation.
const ref = updateUserProfileRef(updateUserProfileVars);
// Variables can be defined inline as well.
const ref = updateUserProfileRef({ displayName: ..., phoneNumber: ..., address: ..., bio: ..., profilePictureUrl: ..., });
// Since all variables are optional for this mutation, you can omit the `UpdateUserProfileVariables` argument.
const ref = updateUserProfileRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserProfileRef(dataConnect, updateUserProfileVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

## CreateRequest
You can execute the `CreateRequest` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createRequest(vars: CreateRequestVariables): MutationPromise<CreateRequestData, CreateRequestVariables>;

interface CreateRequestRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateRequestVariables): MutationRef<CreateRequestData, CreateRequestVariables>;
}
export const createRequestRef: CreateRequestRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createRequest(dc: DataConnect, vars: CreateRequestVariables): MutationPromise<CreateRequestData, CreateRequestVariables>;

interface CreateRequestRef {
  ...
  (dc: DataConnect, vars: CreateRequestVariables): MutationRef<CreateRequestData, CreateRequestVariables>;
}
export const createRequestRef: CreateRequestRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createRequestRef:
```typescript
const name = createRequestRef.operationName;
console.log(name);
```

### Variables
The `CreateRequest` mutation requires an argument of type `CreateRequestVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateRequestVariables {
  foodItemId: UUIDString;
  messageToDonor?: string | null;
}
```
### Return Type
Recall that executing the `CreateRequest` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateRequestData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateRequestData {
  request_insert: Request_Key;
}
```
### Using `CreateRequest`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createRequest, CreateRequestVariables } from '@dataconnect/generated';

// The `CreateRequest` mutation requires an argument of type `CreateRequestVariables`:
const createRequestVars: CreateRequestVariables = {
  foodItemId: ..., 
  messageToDonor: ..., // optional
};

// Call the `createRequest()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createRequest(createRequestVars);
// Variables can be defined inline as well.
const { data } = await createRequest({ foodItemId: ..., messageToDonor: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createRequest(dataConnect, createRequestVars);

console.log(data.request_insert);

// Or, you can use the `Promise` API.
createRequest(createRequestVars).then((response) => {
  const data = response.data;
  console.log(data.request_insert);
});
```

### Using `CreateRequest`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createRequestRef, CreateRequestVariables } from '@dataconnect/generated';

// The `CreateRequest` mutation requires an argument of type `CreateRequestVariables`:
const createRequestVars: CreateRequestVariables = {
  foodItemId: ..., 
  messageToDonor: ..., // optional
};

// Call the `createRequestRef()` function to get a reference to the mutation.
const ref = createRequestRef(createRequestVars);
// Variables can be defined inline as well.
const ref = createRequestRef({ foodItemId: ..., messageToDonor: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createRequestRef(dataConnect, createRequestVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.request_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.request_insert);
});
```

## UpdateRequestStatus
You can execute the `UpdateRequestStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateRequestStatus(vars: UpdateRequestStatusVariables): MutationPromise<UpdateRequestStatusData, UpdateRequestStatusVariables>;

interface UpdateRequestStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateRequestStatusVariables): MutationRef<UpdateRequestStatusData, UpdateRequestStatusVariables>;
}
export const updateRequestStatusRef: UpdateRequestStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateRequestStatus(dc: DataConnect, vars: UpdateRequestStatusVariables): MutationPromise<UpdateRequestStatusData, UpdateRequestStatusVariables>;

interface UpdateRequestStatusRef {
  ...
  (dc: DataConnect, vars: UpdateRequestStatusVariables): MutationRef<UpdateRequestStatusData, UpdateRequestStatusVariables>;
}
export const updateRequestStatusRef: UpdateRequestStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateRequestStatusRef:
```typescript
const name = updateRequestStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateRequestStatus` mutation requires an argument of type `UpdateRequestStatusVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateRequestStatusVariables {
  id: UUIDString;
  status: string;
}
```
### Return Type
Recall that executing the `UpdateRequestStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateRequestStatusData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateRequestStatusData {
  request_update?: Request_Key | null;
}
```
### Using `UpdateRequestStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateRequestStatus, UpdateRequestStatusVariables } from '@dataconnect/generated';

// The `UpdateRequestStatus` mutation requires an argument of type `UpdateRequestStatusVariables`:
const updateRequestStatusVars: UpdateRequestStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateRequestStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateRequestStatus(updateRequestStatusVars);
// Variables can be defined inline as well.
const { data } = await updateRequestStatus({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateRequestStatus(dataConnect, updateRequestStatusVars);

console.log(data.request_update);

// Or, you can use the `Promise` API.
updateRequestStatus(updateRequestStatusVars).then((response) => {
  const data = response.data;
  console.log(data.request_update);
});
```

### Using `UpdateRequestStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateRequestStatusRef, UpdateRequestStatusVariables } from '@dataconnect/generated';

// The `UpdateRequestStatus` mutation requires an argument of type `UpdateRequestStatusVariables`:
const updateRequestStatusVars: UpdateRequestStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateRequestStatusRef()` function to get a reference to the mutation.
const ref = updateRequestStatusRef(updateRequestStatusVars);
// Variables can be defined inline as well.
const ref = updateRequestStatusRef({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateRequestStatusRef(dataConnect, updateRequestStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.request_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.request_update);
});
```

## DeleteRequest
You can execute the `DeleteRequest` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteRequest(vars: DeleteRequestVariables): MutationPromise<DeleteRequestData, DeleteRequestVariables>;

interface DeleteRequestRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteRequestVariables): MutationRef<DeleteRequestData, DeleteRequestVariables>;
}
export const deleteRequestRef: DeleteRequestRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteRequest(dc: DataConnect, vars: DeleteRequestVariables): MutationPromise<DeleteRequestData, DeleteRequestVariables>;

interface DeleteRequestRef {
  ...
  (dc: DataConnect, vars: DeleteRequestVariables): MutationRef<DeleteRequestData, DeleteRequestVariables>;
}
export const deleteRequestRef: DeleteRequestRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteRequestRef:
```typescript
const name = deleteRequestRef.operationName;
console.log(name);
```

### Variables
The `DeleteRequest` mutation requires an argument of type `DeleteRequestVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteRequestVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteRequest` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteRequestData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteRequestData {
  request_delete?: Request_Key | null;
}
```
### Using `DeleteRequest`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteRequest, DeleteRequestVariables } from '@dataconnect/generated';

// The `DeleteRequest` mutation requires an argument of type `DeleteRequestVariables`:
const deleteRequestVars: DeleteRequestVariables = {
  id: ..., 
};

// Call the `deleteRequest()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteRequest(deleteRequestVars);
// Variables can be defined inline as well.
const { data } = await deleteRequest({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteRequest(dataConnect, deleteRequestVars);

console.log(data.request_delete);

// Or, you can use the `Promise` API.
deleteRequest(deleteRequestVars).then((response) => {
  const data = response.data;
  console.log(data.request_delete);
});
```

### Using `DeleteRequest`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteRequestRef, DeleteRequestVariables } from '@dataconnect/generated';

// The `DeleteRequest` mutation requires an argument of type `DeleteRequestVariables`:
const deleteRequestVars: DeleteRequestVariables = {
  id: ..., 
};

// Call the `deleteRequestRef()` function to get a reference to the mutation.
const ref = deleteRequestRef(deleteRequestVars);
// Variables can be defined inline as well.
const ref = deleteRequestRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteRequestRef(dataConnect, deleteRequestVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.request_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.request_delete);
});
```

## CreateReview
You can execute the `CreateReview` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createReview(vars: CreateReviewVariables): MutationPromise<CreateReviewData, CreateReviewVariables>;

interface CreateReviewRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateReviewVariables): MutationRef<CreateReviewData, CreateReviewVariables>;
}
export const createReviewRef: CreateReviewRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createReview(dc: DataConnect, vars: CreateReviewVariables): MutationPromise<CreateReviewData, CreateReviewVariables>;

interface CreateReviewRef {
  ...
  (dc: DataConnect, vars: CreateReviewVariables): MutationRef<CreateReviewData, CreateReviewVariables>;
}
export const createReviewRef: CreateReviewRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createReviewRef:
```typescript
const name = createReviewRef.operationName;
console.log(name);
```

### Variables
The `CreateReview` mutation requires an argument of type `CreateReviewVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateReviewVariables {
  reviewedUserId: UUIDString;
  requestId: UUIDString;
  rating: number;
  comment?: string | null;
}
```
### Return Type
Recall that executing the `CreateReview` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateReviewData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateReviewData {
  review_insert: Review_Key;
}
```
### Using `CreateReview`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createReview, CreateReviewVariables } from '@dataconnect/generated';

// The `CreateReview` mutation requires an argument of type `CreateReviewVariables`:
const createReviewVars: CreateReviewVariables = {
  reviewedUserId: ..., 
  requestId: ..., 
  rating: ..., 
  comment: ..., // optional
};

// Call the `createReview()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createReview(createReviewVars);
// Variables can be defined inline as well.
const { data } = await createReview({ reviewedUserId: ..., requestId: ..., rating: ..., comment: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createReview(dataConnect, createReviewVars);

console.log(data.review_insert);

// Or, you can use the `Promise` API.
createReview(createReviewVars).then((response) => {
  const data = response.data;
  console.log(data.review_insert);
});
```

### Using `CreateReview`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createReviewRef, CreateReviewVariables } from '@dataconnect/generated';

// The `CreateReview` mutation requires an argument of type `CreateReviewVariables`:
const createReviewVars: CreateReviewVariables = {
  reviewedUserId: ..., 
  requestId: ..., 
  rating: ..., 
  comment: ..., // optional
};

// Call the `createReviewRef()` function to get a reference to the mutation.
const ref = createReviewRef(createReviewVars);
// Variables can be defined inline as well.
const ref = createReviewRef({ reviewedUserId: ..., requestId: ..., rating: ..., comment: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createReviewRef(dataConnect, createReviewVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.review_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.review_insert);
});
```

## CreateCommunity
You can execute the `CreateCommunity` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createCommunity(vars: CreateCommunityVariables): MutationPromise<CreateCommunityData, CreateCommunityVariables>;

interface CreateCommunityRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCommunityVariables): MutationRef<CreateCommunityData, CreateCommunityVariables>;
}
export const createCommunityRef: CreateCommunityRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createCommunity(dc: DataConnect, vars: CreateCommunityVariables): MutationPromise<CreateCommunityData, CreateCommunityVariables>;

interface CreateCommunityRef {
  ...
  (dc: DataConnect, vars: CreateCommunityVariables): MutationRef<CreateCommunityData, CreateCommunityVariables>;
}
export const createCommunityRef: CreateCommunityRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createCommunityRef:
```typescript
const name = createCommunityRef.operationName;
console.log(name);
```

### Variables
The `CreateCommunity` mutation requires an argument of type `CreateCommunityVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateCommunityVariables {
  name: string;
  location: string;
  description?: string | null;
}
```
### Return Type
Recall that executing the `CreateCommunity` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateCommunityData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateCommunityData {
  community_insert: Community_Key;
}
```
### Using `CreateCommunity`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createCommunity, CreateCommunityVariables } from '@dataconnect/generated';

// The `CreateCommunity` mutation requires an argument of type `CreateCommunityVariables`:
const createCommunityVars: CreateCommunityVariables = {
  name: ..., 
  location: ..., 
  description: ..., // optional
};

// Call the `createCommunity()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createCommunity(createCommunityVars);
// Variables can be defined inline as well.
const { data } = await createCommunity({ name: ..., location: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createCommunity(dataConnect, createCommunityVars);

console.log(data.community_insert);

// Or, you can use the `Promise` API.
createCommunity(createCommunityVars).then((response) => {
  const data = response.data;
  console.log(data.community_insert);
});
```

### Using `CreateCommunity`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createCommunityRef, CreateCommunityVariables } from '@dataconnect/generated';

// The `CreateCommunity` mutation requires an argument of type `CreateCommunityVariables`:
const createCommunityVars: CreateCommunityVariables = {
  name: ..., 
  location: ..., 
  description: ..., // optional
};

// Call the `createCommunityRef()` function to get a reference to the mutation.
const ref = createCommunityRef(createCommunityVars);
// Variables can be defined inline as well.
const ref = createCommunityRef({ name: ..., location: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createCommunityRef(dataConnect, createCommunityVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.community_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.community_insert);
});
```

## UpdateCommunity
You can execute the `UpdateCommunity` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateCommunity(vars: UpdateCommunityVariables): MutationPromise<UpdateCommunityData, UpdateCommunityVariables>;

interface UpdateCommunityRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateCommunityVariables): MutationRef<UpdateCommunityData, UpdateCommunityVariables>;
}
export const updateCommunityRef: UpdateCommunityRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateCommunity(dc: DataConnect, vars: UpdateCommunityVariables): MutationPromise<UpdateCommunityData, UpdateCommunityVariables>;

interface UpdateCommunityRef {
  ...
  (dc: DataConnect, vars: UpdateCommunityVariables): MutationRef<UpdateCommunityData, UpdateCommunityVariables>;
}
export const updateCommunityRef: UpdateCommunityRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateCommunityRef:
```typescript
const name = updateCommunityRef.operationName;
console.log(name);
```

### Variables
The `UpdateCommunity` mutation requires an argument of type `UpdateCommunityVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateCommunityVariables {
  id: UUIDString;
  name?: string | null;
  location?: string | null;
  description?: string | null;
}
```
### Return Type
Recall that executing the `UpdateCommunity` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateCommunityData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateCommunityData {
  community_update?: Community_Key | null;
}
```
### Using `UpdateCommunity`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateCommunity, UpdateCommunityVariables } from '@dataconnect/generated';

// The `UpdateCommunity` mutation requires an argument of type `UpdateCommunityVariables`:
const updateCommunityVars: UpdateCommunityVariables = {
  id: ..., 
  name: ..., // optional
  location: ..., // optional
  description: ..., // optional
};

// Call the `updateCommunity()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateCommunity(updateCommunityVars);
// Variables can be defined inline as well.
const { data } = await updateCommunity({ id: ..., name: ..., location: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateCommunity(dataConnect, updateCommunityVars);

console.log(data.community_update);

// Or, you can use the `Promise` API.
updateCommunity(updateCommunityVars).then((response) => {
  const data = response.data;
  console.log(data.community_update);
});
```

### Using `UpdateCommunity`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateCommunityRef, UpdateCommunityVariables } from '@dataconnect/generated';

// The `UpdateCommunity` mutation requires an argument of type `UpdateCommunityVariables`:
const updateCommunityVars: UpdateCommunityVariables = {
  id: ..., 
  name: ..., // optional
  location: ..., // optional
  description: ..., // optional
};

// Call the `updateCommunityRef()` function to get a reference to the mutation.
const ref = updateCommunityRef(updateCommunityVars);
// Variables can be defined inline as well.
const ref = updateCommunityRef({ id: ..., name: ..., location: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateCommunityRef(dataConnect, updateCommunityVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.community_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.community_update);
});
```

## DeleteCommunity
You can execute the `DeleteCommunity` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteCommunity(vars: DeleteCommunityVariables): MutationPromise<DeleteCommunityData, DeleteCommunityVariables>;

interface DeleteCommunityRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteCommunityVariables): MutationRef<DeleteCommunityData, DeleteCommunityVariables>;
}
export const deleteCommunityRef: DeleteCommunityRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteCommunity(dc: DataConnect, vars: DeleteCommunityVariables): MutationPromise<DeleteCommunityData, DeleteCommunityVariables>;

interface DeleteCommunityRef {
  ...
  (dc: DataConnect, vars: DeleteCommunityVariables): MutationRef<DeleteCommunityData, DeleteCommunityVariables>;
}
export const deleteCommunityRef: DeleteCommunityRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteCommunityRef:
```typescript
const name = deleteCommunityRef.operationName;
console.log(name);
```

### Variables
The `DeleteCommunity` mutation requires an argument of type `DeleteCommunityVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteCommunityVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteCommunity` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteCommunityData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteCommunityData {
  community_delete?: Community_Key | null;
}
```
### Using `DeleteCommunity`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteCommunity, DeleteCommunityVariables } from '@dataconnect/generated';

// The `DeleteCommunity` mutation requires an argument of type `DeleteCommunityVariables`:
const deleteCommunityVars: DeleteCommunityVariables = {
  id: ..., 
};

// Call the `deleteCommunity()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteCommunity(deleteCommunityVars);
// Variables can be defined inline as well.
const { data } = await deleteCommunity({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteCommunity(dataConnect, deleteCommunityVars);

console.log(data.community_delete);

// Or, you can use the `Promise` API.
deleteCommunity(deleteCommunityVars).then((response) => {
  const data = response.data;
  console.log(data.community_delete);
});
```

### Using `DeleteCommunity`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteCommunityRef, DeleteCommunityVariables } from '@dataconnect/generated';

// The `DeleteCommunity` mutation requires an argument of type `DeleteCommunityVariables`:
const deleteCommunityVars: DeleteCommunityVariables = {
  id: ..., 
};

// Call the `deleteCommunityRef()` function to get a reference to the mutation.
const ref = deleteCommunityRef(deleteCommunityVars);
// Variables can be defined inline as well.
const ref = deleteCommunityRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteCommunityRef(dataConnect, deleteCommunityVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.community_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.community_delete);
});
```

