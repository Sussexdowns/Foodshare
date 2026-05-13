# Generated React README
This README will guide you through the process of using the generated React SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `JavaScript README`, you can find it at [`dataconnect-generated/README.md`](../README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

You can use this generated SDK by importing from the package `@dataconnect/generated/react` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#react).

# Table of Contents
- [**Overview**](#generated-react-readme)
- [**TanStack Query Firebase & TanStack React Query**](#tanstack-query-firebase-tanstack-react-query)
  - [*Package Installation*](#installing-tanstack-query-firebase-and-tanstack-react-query-packages)
  - [*Configuring TanStack Query*](#configuring-tanstack-query)
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

# TanStack Query Firebase & TanStack React Query
This SDK provides [React](https://react.dev/) hooks generated specific to your application, for the operations found in the connector `example`. These hooks are generated using [TanStack Query Firebase](https://react-query-firebase.invertase.dev/) by our partners at Invertase, a library built on top of [TanStack React Query v5](https://tanstack.com/query/v5/docs/framework/react/overview).

***You do not need to be familiar with Tanstack Query or Tanstack Query Firebase to use this SDK.*** However, you may find it useful to learn more about them, as they will empower you as a user of this Generated React SDK.

## Installing TanStack Query Firebase and TanStack React Query Packages
In order to use the React generated SDK, you must install the `TanStack React Query` and `TanStack Query Firebase` packages.
```bash
npm i --save @tanstack/react-query @tanstack-query-firebase/react
```
```bash
npm i --save firebase@latest # Note: React has a peer dependency on ^11.3.0
```

You can also follow the installation instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#tanstack-install), or the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react) and [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/installation).

## Configuring TanStack Query
In order to use the React generated SDK in your application, you must wrap your application's component tree in a `QueryClientProvider` component from TanStack React Query. None of your generated React SDK hooks will work without this provider.

```javascript
import { QueryClientProvider } from '@tanstack/react-query';

// Create a TanStack Query client instance
const queryClient = new QueryClient()

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <MyApplication />
    </QueryClientProvider>
  )
}
```

To learn more about `QueryClientProvider`, see the [TanStack React Query documentation](https://tanstack.com/query/latest/docs/framework/react/quick-start) and the [TanStack Query Firebase documentation](https://invertase.docs.page/tanstack-query-firebase/react#usage).

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`.

You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#emulator-react-angular).

```javascript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) using the hooks provided from your generated React SDK.

# Queries

The React generated SDK provides Query hook functions that call and return [`useDataConnectQuery`](https://react-query-firebase.invertase.dev/react/data-connect/querying) hooks from TanStack Query Firebase.

Calling these hook functions will return a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and the most recent data returned by the Query, among other things. To learn more about these hooks and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react/data-connect/querying).

TanStack React Query caches the results of your Queries, so using the same Query hook function in multiple places in your application allows the entire application to automatically see updates to that Query's data.

Query hooks execute their Queries automatically when called, and periodically refresh, unless you change the `queryOptions` for the Query. To learn how to stop a Query from automatically executing, including how to make a query "lazy", see the [TanStack React Query documentation](https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries).

To learn more about TanStack React Query's Queries, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/queries).

## Using Query Hooks
Here's a general overview of how to use the generated Query hooks in your code:

- If the Query has no variables, the Query hook function does not require arguments.
- If the Query has any required variables, the Query hook function will require at least one argument: an object that contains all the required variables for the Query.
- If the Query has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Query's variables are optional, the Query hook function does not require any arguments.
- Query hook functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.
- Query hooks functions can be called with or without passing in an `options` argument of type `useDataConnectQueryOptions`. To learn more about the `options` argument, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/query-options).
  - ***Special case:***  If the Query has all optional variables and you would like to provide an `options` argument to the Query hook function without providing any variables, you must pass `undefined` where you would normally pass the Query's variables, and then may provide the `options` argument.

Below are examples of how to use the `example` connector's generated Query hook functions to execute each Query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## ListFoodItems
You can execute the `ListFoodItems` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListFoodItems(dc: DataConnect, options?: useDataConnectQueryOptions<ListFoodItemsData>): UseDataConnectQueryResult<ListFoodItemsData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListFoodItems(options?: useDataConnectQueryOptions<ListFoodItemsData>): UseDataConnectQueryResult<ListFoodItemsData, undefined>;
```

### Variables
The `ListFoodItems` Query has no variables.
### Return Type
Recall that calling the `ListFoodItems` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListFoodItems` Query is of type `ListFoodItemsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListFoodItems`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useListFoodItems } from '@dataconnect/generated/react'

export default function ListFoodItemsComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListFoodItems();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListFoodItems(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListFoodItems(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListFoodItems(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.foodItems);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetFoodItemById
You can execute the `GetFoodItemById` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetFoodItemById(dc: DataConnect, vars: GetFoodItemByIdVariables, options?: useDataConnectQueryOptions<GetFoodItemByIdData>): UseDataConnectQueryResult<GetFoodItemByIdData, GetFoodItemByIdVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetFoodItemById(vars: GetFoodItemByIdVariables, options?: useDataConnectQueryOptions<GetFoodItemByIdData>): UseDataConnectQueryResult<GetFoodItemByIdData, GetFoodItemByIdVariables>;
```

### Variables
The `GetFoodItemById` Query requires an argument of type `GetFoodItemByIdVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetFoodItemByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `GetFoodItemById` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetFoodItemById` Query is of type `GetFoodItemByIdData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetFoodItemById`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetFoodItemByIdVariables } from '@dataconnect/generated';
import { useGetFoodItemById } from '@dataconnect/generated/react'

export default function GetFoodItemByIdComponent() {
  // The `useGetFoodItemById` Query hook requires an argument of type `GetFoodItemByIdVariables`:
  const getFoodItemByIdVars: GetFoodItemByIdVariables = {
    id: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetFoodItemById(getFoodItemByIdVars);
  // Variables can be defined inline as well.
  const query = useGetFoodItemById({ id: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetFoodItemById(dataConnect, getFoodItemByIdVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetFoodItemById(getFoodItemByIdVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetFoodItemById(dataConnect, getFoodItemByIdVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.foodItem);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## SearchFoodItems
You can execute the `SearchFoodItems` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useSearchFoodItems(dc: DataConnect, vars?: SearchFoodItemsVariables, options?: useDataConnectQueryOptions<SearchFoodItemsData>): UseDataConnectQueryResult<SearchFoodItemsData, SearchFoodItemsVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useSearchFoodItems(vars?: SearchFoodItemsVariables, options?: useDataConnectQueryOptions<SearchFoodItemsData>): UseDataConnectQueryResult<SearchFoodItemsData, SearchFoodItemsVariables>;
```

### Variables
The `SearchFoodItems` Query has an optional argument of type `SearchFoodItemsVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface SearchFoodItemsVariables {
  category?: string | null;
  name?: string | null;
  status?: string | null;
}
```
### Return Type
Recall that calling the `SearchFoodItems` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `SearchFoodItems` Query is of type `SearchFoodItemsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `SearchFoodItems`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, SearchFoodItemsVariables } from '@dataconnect/generated';
import { useSearchFoodItems } from '@dataconnect/generated/react'

export default function SearchFoodItemsComponent() {
  // The `useSearchFoodItems` Query hook has an optional argument of type `SearchFoodItemsVariables`:
  const searchFoodItemsVars: SearchFoodItemsVariables = {
    category: ..., // optional
    name: ..., // optional
    status: ..., // optional
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useSearchFoodItems(searchFoodItemsVars);
  // Variables can be defined inline as well.
  const query = useSearchFoodItems({ category: ..., name: ..., status: ..., });
  // Since all variables are optional for this Query, you can omit the `SearchFoodItemsVariables` argument.
  // (as long as you don't want to provide any `options`!)
  const query = useSearchFoodItems();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useSearchFoodItems(dataConnect, searchFoodItemsVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useSearchFoodItems(searchFoodItemsVars, options);
  // If you'd like to provide options without providing any variables, you must
  // pass `undefined` where you would normally pass the variables.
  const query = useSearchFoodItems(undefined, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useSearchFoodItems(dataConnect, searchFoodItemsVars /** or undefined */, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.foodItems);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListFoodItemsByCategory
You can execute the `ListFoodItemsByCategory` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListFoodItemsByCategory(dc: DataConnect, vars: ListFoodItemsByCategoryVariables, options?: useDataConnectQueryOptions<ListFoodItemsByCategoryData>): UseDataConnectQueryResult<ListFoodItemsByCategoryData, ListFoodItemsByCategoryVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListFoodItemsByCategory(vars: ListFoodItemsByCategoryVariables, options?: useDataConnectQueryOptions<ListFoodItemsByCategoryData>): UseDataConnectQueryResult<ListFoodItemsByCategoryData, ListFoodItemsByCategoryVariables>;
```

### Variables
The `ListFoodItemsByCategory` Query requires an argument of type `ListFoodItemsByCategoryVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListFoodItemsByCategoryVariables {
  category: string;
}
```
### Return Type
Recall that calling the `ListFoodItemsByCategory` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListFoodItemsByCategory` Query is of type `ListFoodItemsByCategoryData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListFoodItemsByCategory`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListFoodItemsByCategoryVariables } from '@dataconnect/generated';
import { useListFoodItemsByCategory } from '@dataconnect/generated/react'

export default function ListFoodItemsByCategoryComponent() {
  // The `useListFoodItemsByCategory` Query hook requires an argument of type `ListFoodItemsByCategoryVariables`:
  const listFoodItemsByCategoryVars: ListFoodItemsByCategoryVariables = {
    category: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListFoodItemsByCategory(listFoodItemsByCategoryVars);
  // Variables can be defined inline as well.
  const query = useListFoodItemsByCategory({ category: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListFoodItemsByCategory(dataConnect, listFoodItemsByCategoryVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListFoodItemsByCategory(listFoodItemsByCategoryVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListFoodItemsByCategory(dataConnect, listFoodItemsByCategoryVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.foodItems);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListFoodItemsByLocation
You can execute the `ListFoodItemsByLocation` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListFoodItemsByLocation(dc: DataConnect, vars?: ListFoodItemsByLocationVariables, options?: useDataConnectQueryOptions<ListFoodItemsByLocationData>): UseDataConnectQueryResult<ListFoodItemsByLocationData, ListFoodItemsByLocationVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListFoodItemsByLocation(vars?: ListFoodItemsByLocationVariables, options?: useDataConnectQueryOptions<ListFoodItemsByLocationData>): UseDataConnectQueryResult<ListFoodItemsByLocationData, ListFoodItemsByLocationVariables>;
```

### Variables
The `ListFoodItemsByLocation` Query has an optional argument of type `ListFoodItemsByLocationVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListFoodItemsByLocationVariables {
  town?: string | null;
  county?: string | null;
}
```
### Return Type
Recall that calling the `ListFoodItemsByLocation` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListFoodItemsByLocation` Query is of type `ListFoodItemsByLocationData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListFoodItemsByLocation`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListFoodItemsByLocationVariables } from '@dataconnect/generated';
import { useListFoodItemsByLocation } from '@dataconnect/generated/react'

export default function ListFoodItemsByLocationComponent() {
  // The `useListFoodItemsByLocation` Query hook has an optional argument of type `ListFoodItemsByLocationVariables`:
  const listFoodItemsByLocationVars: ListFoodItemsByLocationVariables = {
    town: ..., // optional
    county: ..., // optional
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListFoodItemsByLocation(listFoodItemsByLocationVars);
  // Variables can be defined inline as well.
  const query = useListFoodItemsByLocation({ town: ..., county: ..., });
  // Since all variables are optional for this Query, you can omit the `ListFoodItemsByLocationVariables` argument.
  // (as long as you don't want to provide any `options`!)
  const query = useListFoodItemsByLocation();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListFoodItemsByLocation(dataConnect, listFoodItemsByLocationVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListFoodItemsByLocation(listFoodItemsByLocationVars, options);
  // If you'd like to provide options without providing any variables, you must
  // pass `undefined` where you would normally pass the variables.
  const query = useListFoodItemsByLocation(undefined, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListFoodItemsByLocation(dataConnect, listFoodItemsByLocationVars /** or undefined */, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.foodItems);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListFoodItemsInBounds
You can execute the `ListFoodItemsInBounds` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListFoodItemsInBounds(dc: DataConnect, vars: ListFoodItemsInBoundsVariables, options?: useDataConnectQueryOptions<ListFoodItemsInBoundsData>): UseDataConnectQueryResult<ListFoodItemsInBoundsData, ListFoodItemsInBoundsVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListFoodItemsInBounds(vars: ListFoodItemsInBoundsVariables, options?: useDataConnectQueryOptions<ListFoodItemsInBoundsData>): UseDataConnectQueryResult<ListFoodItemsInBoundsData, ListFoodItemsInBoundsVariables>;
```

### Variables
The `ListFoodItemsInBounds` Query requires an argument of type `ListFoodItemsInBoundsVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListFoodItemsInBoundsVariables {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}
```
### Return Type
Recall that calling the `ListFoodItemsInBounds` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListFoodItemsInBounds` Query is of type `ListFoodItemsInBoundsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListFoodItemsInBounds`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListFoodItemsInBoundsVariables } from '@dataconnect/generated';
import { useListFoodItemsInBounds } from '@dataconnect/generated/react'

export default function ListFoodItemsInBoundsComponent() {
  // The `useListFoodItemsInBounds` Query hook requires an argument of type `ListFoodItemsInBoundsVariables`:
  const listFoodItemsInBoundsVars: ListFoodItemsInBoundsVariables = {
    minLat: ..., 
    maxLat: ..., 
    minLng: ..., 
    maxLng: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListFoodItemsInBounds(listFoodItemsInBoundsVars);
  // Variables can be defined inline as well.
  const query = useListFoodItemsInBounds({ minLat: ..., maxLat: ..., minLng: ..., maxLng: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListFoodItemsInBounds(dataConnect, listFoodItemsInBoundsVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListFoodItemsInBounds(listFoodItemsInBoundsVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListFoodItemsInBounds(dataConnect, listFoodItemsInBoundsVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.foodItems);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListMyFoodItems
You can execute the `ListMyFoodItems` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListMyFoodItems(dc: DataConnect, options?: useDataConnectQueryOptions<ListMyFoodItemsData>): UseDataConnectQueryResult<ListMyFoodItemsData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListMyFoodItems(options?: useDataConnectQueryOptions<ListMyFoodItemsData>): UseDataConnectQueryResult<ListMyFoodItemsData, undefined>;
```

### Variables
The `ListMyFoodItems` Query has no variables.
### Return Type
Recall that calling the `ListMyFoodItems` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListMyFoodItems` Query is of type `ListMyFoodItemsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListMyFoodItems`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useListMyFoodItems } from '@dataconnect/generated/react'

export default function ListMyFoodItemsComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListMyFoodItems();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListMyFoodItems(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListMyFoodItems(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListMyFoodItems(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.user);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListCommunities
You can execute the `ListCommunities` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListCommunities(dc: DataConnect, options?: useDataConnectQueryOptions<ListCommunitiesData>): UseDataConnectQueryResult<ListCommunitiesData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListCommunities(options?: useDataConnectQueryOptions<ListCommunitiesData>): UseDataConnectQueryResult<ListCommunitiesData, undefined>;
```

### Variables
The `ListCommunities` Query has no variables.
### Return Type
Recall that calling the `ListCommunities` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListCommunities` Query is of type `ListCommunitiesData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListCommunities`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useListCommunities } from '@dataconnect/generated/react'

export default function ListCommunitiesComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListCommunities();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListCommunities(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListCommunities(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListCommunities(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.communities);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetCommunityById
You can execute the `GetCommunityById` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useGetCommunityById(dc: DataConnect, vars: GetCommunityByIdVariables, options?: useDataConnectQueryOptions<GetCommunityByIdData>): UseDataConnectQueryResult<GetCommunityByIdData, GetCommunityByIdVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetCommunityById(vars: GetCommunityByIdVariables, options?: useDataConnectQueryOptions<GetCommunityByIdData>): UseDataConnectQueryResult<GetCommunityByIdData, GetCommunityByIdVariables>;
```

### Variables
The `GetCommunityById` Query requires an argument of type `GetCommunityByIdVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetCommunityByIdVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `GetCommunityById` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetCommunityById` Query is of type `GetCommunityByIdData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetCommunityById`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetCommunityByIdVariables } from '@dataconnect/generated';
import { useGetCommunityById } from '@dataconnect/generated/react'

export default function GetCommunityByIdComponent() {
  // The `useGetCommunityById` Query hook requires an argument of type `GetCommunityByIdVariables`:
  const getCommunityByIdVars: GetCommunityByIdVariables = {
    id: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetCommunityById(getCommunityByIdVars);
  // Variables can be defined inline as well.
  const query = useGetCommunityById({ id: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetCommunityById(dataConnect, getCommunityByIdVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetCommunityById(getCommunityByIdVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetCommunityById(dataConnect, getCommunityByIdVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.community);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListMyRequests
You can execute the `ListMyRequests` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListMyRequests(dc: DataConnect, options?: useDataConnectQueryOptions<ListMyRequestsData>): UseDataConnectQueryResult<ListMyRequestsData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListMyRequests(options?: useDataConnectQueryOptions<ListMyRequestsData>): UseDataConnectQueryResult<ListMyRequestsData, undefined>;
```

### Variables
The `ListMyRequests` Query has no variables.
### Return Type
Recall that calling the `ListMyRequests` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListMyRequests` Query is of type `ListMyRequestsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListMyRequests`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';
import { useListMyRequests } from '@dataconnect/generated/react'

export default function ListMyRequestsComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListMyRequests();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListMyRequests(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListMyRequests(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListMyRequests(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.user);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## ListUserReviews
You can execute the `ListUserReviews` Query using the following Query hook function, which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts):

```javascript
useListUserReviews(dc: DataConnect, vars: ListUserReviewsVariables, options?: useDataConnectQueryOptions<ListUserReviewsData>): UseDataConnectQueryResult<ListUserReviewsData, ListUserReviewsVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useListUserReviews(vars: ListUserReviewsVariables, options?: useDataConnectQueryOptions<ListUserReviewsData>): UseDataConnectQueryResult<ListUserReviewsData, ListUserReviewsVariables>;
```

### Variables
The `ListUserReviews` Query requires an argument of type `ListUserReviewsVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface ListUserReviewsVariables {
  userId: UUIDString;
}
```
### Return Type
Recall that calling the `ListUserReviews` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `ListUserReviews` Query is of type `ListUserReviewsData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `ListUserReviews`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, ListUserReviewsVariables } from '@dataconnect/generated';
import { useListUserReviews } from '@dataconnect/generated/react'

export default function ListUserReviewsComponent() {
  // The `useListUserReviews` Query hook requires an argument of type `ListUserReviewsVariables`:
  const listUserReviewsVars: ListUserReviewsVariables = {
    userId: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useListUserReviews(listUserReviewsVars);
  // Variables can be defined inline as well.
  const query = useListUserReviews({ userId: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useListUserReviews(dataConnect, listUserReviewsVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useListUserReviews(listUserReviewsVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useListUserReviews(dataConnect, listUserReviewsVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.reviews);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

# Mutations

The React generated SDK provides Mutations hook functions that call and return [`useDataConnectMutation`](https://react-query-firebase.invertase.dev/react/data-connect/mutations) hooks from TanStack Query Firebase.

Calling these hook functions will return a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, and the most recent data returned by the Mutation, among other things. To learn more about these hooks and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react/data-connect/mutations).

Mutation hooks do not execute their Mutations automatically when called. Rather, after calling the Mutation hook function and getting a `UseMutationResult` object, you must call the `UseMutationResult.mutate()` function to execute the Mutation.

To learn more about TanStack React Query's Mutations, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/mutations).

## Using Mutation Hooks
Here's a general overview of how to use the generated Mutation hooks in your code:

- Mutation hook functions are not called with the arguments to the Mutation. Instead, arguments are passed to `UseMutationResult.mutate()`.
- If the Mutation has no variables, the `mutate()` function does not require arguments.
- If the Mutation has any required variables, the `mutate()` function will require at least one argument: an object that contains all the required variables for the Mutation.
- If the Mutation has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Mutation's variables are optional, the Mutation hook function does not require any arguments.
- Mutation hook functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.
- Mutation hooks also accept an `options` argument of type `useDataConnectMutationOptions`. To learn more about the `options` argument, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/mutations#mutation-side-effects).
  - `UseMutationResult.mutate()` also accepts an `options` argument of type `useDataConnectMutationOptions`.
  - ***Special case:*** If the Mutation has no arguments (or all optional arguments and you wish to provide none), and you want to pass `options` to `UseMutationResult.mutate()`, you must pass `undefined` where you would normally pass the Mutation's arguments, and then may provide the options argument.

Below are examples of how to use the `example` connector's generated Mutation hook functions to execute each Mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## CreateFoodItem
You can execute the `CreateFoodItem` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateFoodItem(options?: useDataConnectMutationOptions<CreateFoodItemData, FirebaseError, CreateFoodItemVariables>): UseDataConnectMutationResult<CreateFoodItemData, CreateFoodItemVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateFoodItem(dc: DataConnect, options?: useDataConnectMutationOptions<CreateFoodItemData, FirebaseError, CreateFoodItemVariables>): UseDataConnectMutationResult<CreateFoodItemData, CreateFoodItemVariables>;
```

### Variables
The `CreateFoodItem` Mutation requires an argument of type `CreateFoodItemVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `CreateFoodItem` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateFoodItem` Mutation is of type `CreateFoodItemData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateFoodItemData {
  foodItem_insert: FoodItem_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateFoodItem`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateFoodItemVariables } from '@dataconnect/generated';
import { useCreateFoodItem } from '@dataconnect/generated/react'

export default function CreateFoodItemComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateFoodItem();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateFoodItem(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateFoodItem(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateFoodItem(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateFoodItem` Mutation requires an argument of type `CreateFoodItemVariables`:
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
  mutation.mutate(createFoodItemVars);
  // Variables can be defined inline as well.
  mutation.mutate({ name: ..., description: ..., quantity: ..., category: ..., expirationDate: ..., pickupInstructions: ..., imageUrl: ..., lat: ..., lng: ..., address: ..., town: ..., county: ..., postcode: ..., season: ..., originalType: ..., link: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createFoodItemVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.foodItem_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateFoodItem
You can execute the `UpdateFoodItem` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateFoodItem(options?: useDataConnectMutationOptions<UpdateFoodItemData, FirebaseError, UpdateFoodItemVariables>): UseDataConnectMutationResult<UpdateFoodItemData, UpdateFoodItemVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateFoodItem(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateFoodItemData, FirebaseError, UpdateFoodItemVariables>): UseDataConnectMutationResult<UpdateFoodItemData, UpdateFoodItemVariables>;
```

### Variables
The `UpdateFoodItem` Mutation requires an argument of type `UpdateFoodItemVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `UpdateFoodItem` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateFoodItem` Mutation is of type `UpdateFoodItemData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateFoodItemData {
  foodItem_update?: FoodItem_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateFoodItem`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateFoodItemVariables } from '@dataconnect/generated';
import { useUpdateFoodItem } from '@dataconnect/generated/react'

export default function UpdateFoodItemComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateFoodItem();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateFoodItem(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateFoodItem(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateFoodItem(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateFoodItem` Mutation requires an argument of type `UpdateFoodItemVariables`:
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
  mutation.mutate(updateFoodItemVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., name: ..., description: ..., quantity: ..., category: ..., status: ..., expirationDate: ..., pickupInstructions: ..., imageUrl: ..., lat: ..., lng: ..., address: ..., town: ..., county: ..., postcode: ..., season: ..., originalType: ..., link: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateFoodItemVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.foodItem_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteFoodItem
You can execute the `DeleteFoodItem` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteFoodItem(options?: useDataConnectMutationOptions<DeleteFoodItemData, FirebaseError, DeleteFoodItemVariables>): UseDataConnectMutationResult<DeleteFoodItemData, DeleteFoodItemVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteFoodItem(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteFoodItemData, FirebaseError, DeleteFoodItemVariables>): UseDataConnectMutationResult<DeleteFoodItemData, DeleteFoodItemVariables>;
```

### Variables
The `DeleteFoodItem` Mutation requires an argument of type `DeleteFoodItemVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteFoodItemVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `DeleteFoodItem` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteFoodItem` Mutation is of type `DeleteFoodItemData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteFoodItemData {
  foodItem_delete?: FoodItem_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteFoodItem`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteFoodItemVariables } from '@dataconnect/generated';
import { useDeleteFoodItem } from '@dataconnect/generated/react'

export default function DeleteFoodItemComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteFoodItem();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteFoodItem(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteFoodItem(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteFoodItem(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteFoodItem` Mutation requires an argument of type `DeleteFoodItemVariables`:
  const deleteFoodItemVars: DeleteFoodItemVariables = {
    id: ..., 
  };
  mutation.mutate(deleteFoodItemVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteFoodItemVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.foodItem_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateFoodItemStatus
You can execute the `UpdateFoodItemStatus` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateFoodItemStatus(options?: useDataConnectMutationOptions<UpdateFoodItemStatusData, FirebaseError, UpdateFoodItemStatusVariables>): UseDataConnectMutationResult<UpdateFoodItemStatusData, UpdateFoodItemStatusVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateFoodItemStatus(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateFoodItemStatusData, FirebaseError, UpdateFoodItemStatusVariables>): UseDataConnectMutationResult<UpdateFoodItemStatusData, UpdateFoodItemStatusVariables>;
```

### Variables
The `UpdateFoodItemStatus` Mutation requires an argument of type `UpdateFoodItemStatusVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdateFoodItemStatusVariables {
  id: UUIDString;
  status: string;
}
```
### Return Type
Recall that calling the `UpdateFoodItemStatus` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateFoodItemStatus` Mutation is of type `UpdateFoodItemStatusData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateFoodItemStatusData {
  foodItem_update?: FoodItem_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateFoodItemStatus`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateFoodItemStatusVariables } from '@dataconnect/generated';
import { useUpdateFoodItemStatus } from '@dataconnect/generated/react'

export default function UpdateFoodItemStatusComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateFoodItemStatus();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateFoodItemStatus(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateFoodItemStatus(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateFoodItemStatus(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateFoodItemStatus` Mutation requires an argument of type `UpdateFoodItemStatusVariables`:
  const updateFoodItemStatusVars: UpdateFoodItemStatusVariables = {
    id: ..., 
    status: ..., 
  };
  mutation.mutate(updateFoodItemStatusVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., status: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateFoodItemStatusVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.foodItem_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpsertUser
You can execute the `UpsertUser` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpsertUser(options?: useDataConnectMutationOptions<UpsertUserData, FirebaseError, UpsertUserVariables>): UseDataConnectMutationResult<UpsertUserData, UpsertUserVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpsertUser(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertUserData, FirebaseError, UpsertUserVariables>): UseDataConnectMutationResult<UpsertUserData, UpsertUserVariables>;
```

### Variables
The `UpsertUser` Mutation requires an argument of type `UpsertUserVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `UpsertUser` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpsertUser` Mutation is of type `UpsertUserData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpsertUserData {
  user_upsert: User_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpsertUser`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpsertUserVariables } from '@dataconnect/generated';
import { useUpsertUser } from '@dataconnect/generated/react'

export default function UpsertUserComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpsertUser();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpsertUser(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertUser(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpsertUser(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpsertUser` Mutation requires an argument of type `UpsertUserVariables`:
  const upsertUserVars: UpsertUserVariables = {
    displayName: ..., 
    email: ..., 
    userType: ..., 
    phoneNumber: ..., // optional
    address: ..., // optional
    bio: ..., // optional
    profilePictureUrl: ..., // optional
  };
  mutation.mutate(upsertUserVars);
  // Variables can be defined inline as well.
  mutation.mutate({ displayName: ..., email: ..., userType: ..., phoneNumber: ..., address: ..., bio: ..., profilePictureUrl: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(upsertUserVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.user_upsert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateUserProfile
You can execute the `UpdateUserProfile` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateUserProfile(options?: useDataConnectMutationOptions<UpdateUserProfileData, FirebaseError, UpdateUserProfileVariables | void>): UseDataConnectMutationResult<UpdateUserProfileData, UpdateUserProfileVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateUserProfile(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateUserProfileData, FirebaseError, UpdateUserProfileVariables | void>): UseDataConnectMutationResult<UpdateUserProfileData, UpdateUserProfileVariables>;
```

### Variables
The `UpdateUserProfile` Mutation has an optional argument of type `UpdateUserProfileVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdateUserProfileVariables {
  displayName?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  bio?: string | null;
  profilePictureUrl?: string | null;
}
```
### Return Type
Recall that calling the `UpdateUserProfile` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateUserProfile` Mutation is of type `UpdateUserProfileData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateUserProfileData {
  user_update?: User_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateUserProfile`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateUserProfileVariables } from '@dataconnect/generated';
import { useUpdateUserProfile } from '@dataconnect/generated/react'

export default function UpdateUserProfileComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateUserProfile();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateUserProfile(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateUserProfile(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateUserProfile(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateUserProfile` Mutation has an optional argument of type `UpdateUserProfileVariables`:
  const updateUserProfileVars: UpdateUserProfileVariables = {
    displayName: ..., // optional
    phoneNumber: ..., // optional
    address: ..., // optional
    bio: ..., // optional
    profilePictureUrl: ..., // optional
  };
  mutation.mutate(updateUserProfileVars);
  // Variables can be defined inline as well.
  mutation.mutate({ displayName: ..., phoneNumber: ..., address: ..., bio: ..., profilePictureUrl: ..., });
  // Since all variables are optional for this Mutation, you can omit the `UpdateUserProfileVariables` argument.
  mutation.mutate();

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  // Since all variables are optional for this Mutation, you can provide options without providing any variables.
  // To do so, you must pass `undefined` where you would normally pass the variables.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateUserProfileVars /** or undefined */, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.user_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateRequest
You can execute the `CreateRequest` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateRequest(options?: useDataConnectMutationOptions<CreateRequestData, FirebaseError, CreateRequestVariables>): UseDataConnectMutationResult<CreateRequestData, CreateRequestVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateRequest(dc: DataConnect, options?: useDataConnectMutationOptions<CreateRequestData, FirebaseError, CreateRequestVariables>): UseDataConnectMutationResult<CreateRequestData, CreateRequestVariables>;
```

### Variables
The `CreateRequest` Mutation requires an argument of type `CreateRequestVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface CreateRequestVariables {
  foodItemId: UUIDString;
  messageToDonor?: string | null;
}
```
### Return Type
Recall that calling the `CreateRequest` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateRequest` Mutation is of type `CreateRequestData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateRequestData {
  request_insert: Request_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateRequest`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateRequestVariables } from '@dataconnect/generated';
import { useCreateRequest } from '@dataconnect/generated/react'

export default function CreateRequestComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateRequest();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateRequest(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateRequest(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateRequest(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateRequest` Mutation requires an argument of type `CreateRequestVariables`:
  const createRequestVars: CreateRequestVariables = {
    foodItemId: ..., 
    messageToDonor: ..., // optional
  };
  mutation.mutate(createRequestVars);
  // Variables can be defined inline as well.
  mutation.mutate({ foodItemId: ..., messageToDonor: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createRequestVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.request_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateRequestStatus
You can execute the `UpdateRequestStatus` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateRequestStatus(options?: useDataConnectMutationOptions<UpdateRequestStatusData, FirebaseError, UpdateRequestStatusVariables>): UseDataConnectMutationResult<UpdateRequestStatusData, UpdateRequestStatusVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateRequestStatus(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateRequestStatusData, FirebaseError, UpdateRequestStatusVariables>): UseDataConnectMutationResult<UpdateRequestStatusData, UpdateRequestStatusVariables>;
```

### Variables
The `UpdateRequestStatus` Mutation requires an argument of type `UpdateRequestStatusVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdateRequestStatusVariables {
  id: UUIDString;
  status: string;
}
```
### Return Type
Recall that calling the `UpdateRequestStatus` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateRequestStatus` Mutation is of type `UpdateRequestStatusData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateRequestStatusData {
  request_update?: Request_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateRequestStatus`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateRequestStatusVariables } from '@dataconnect/generated';
import { useUpdateRequestStatus } from '@dataconnect/generated/react'

export default function UpdateRequestStatusComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateRequestStatus();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateRequestStatus(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateRequestStatus(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateRequestStatus(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateRequestStatus` Mutation requires an argument of type `UpdateRequestStatusVariables`:
  const updateRequestStatusVars: UpdateRequestStatusVariables = {
    id: ..., 
    status: ..., 
  };
  mutation.mutate(updateRequestStatusVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., status: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateRequestStatusVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.request_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteRequest
You can execute the `DeleteRequest` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteRequest(options?: useDataConnectMutationOptions<DeleteRequestData, FirebaseError, DeleteRequestVariables>): UseDataConnectMutationResult<DeleteRequestData, DeleteRequestVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteRequest(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteRequestData, FirebaseError, DeleteRequestVariables>): UseDataConnectMutationResult<DeleteRequestData, DeleteRequestVariables>;
```

### Variables
The `DeleteRequest` Mutation requires an argument of type `DeleteRequestVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteRequestVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `DeleteRequest` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteRequest` Mutation is of type `DeleteRequestData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteRequestData {
  request_delete?: Request_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteRequest`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteRequestVariables } from '@dataconnect/generated';
import { useDeleteRequest } from '@dataconnect/generated/react'

export default function DeleteRequestComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteRequest();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteRequest(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteRequest(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteRequest(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteRequest` Mutation requires an argument of type `DeleteRequestVariables`:
  const deleteRequestVars: DeleteRequestVariables = {
    id: ..., 
  };
  mutation.mutate(deleteRequestVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteRequestVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.request_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateReview
You can execute the `CreateReview` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateReview(options?: useDataConnectMutationOptions<CreateReviewData, FirebaseError, CreateReviewVariables>): UseDataConnectMutationResult<CreateReviewData, CreateReviewVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateReview(dc: DataConnect, options?: useDataConnectMutationOptions<CreateReviewData, FirebaseError, CreateReviewVariables>): UseDataConnectMutationResult<CreateReviewData, CreateReviewVariables>;
```

### Variables
The `CreateReview` Mutation requires an argument of type `CreateReviewVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface CreateReviewVariables {
  reviewedUserId: UUIDString;
  requestId: UUIDString;
  rating: number;
  comment?: string | null;
}
```
### Return Type
Recall that calling the `CreateReview` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateReview` Mutation is of type `CreateReviewData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateReviewData {
  review_insert: Review_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateReview`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateReviewVariables } from '@dataconnect/generated';
import { useCreateReview } from '@dataconnect/generated/react'

export default function CreateReviewComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateReview();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateReview(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateReview(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateReview(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateReview` Mutation requires an argument of type `CreateReviewVariables`:
  const createReviewVars: CreateReviewVariables = {
    reviewedUserId: ..., 
    requestId: ..., 
    rating: ..., 
    comment: ..., // optional
  };
  mutation.mutate(createReviewVars);
  // Variables can be defined inline as well.
  mutation.mutate({ reviewedUserId: ..., requestId: ..., rating: ..., comment: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createReviewVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.review_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateCommunity
You can execute the `CreateCommunity` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useCreateCommunity(options?: useDataConnectMutationOptions<CreateCommunityData, FirebaseError, CreateCommunityVariables>): UseDataConnectMutationResult<CreateCommunityData, CreateCommunityVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateCommunity(dc: DataConnect, options?: useDataConnectMutationOptions<CreateCommunityData, FirebaseError, CreateCommunityVariables>): UseDataConnectMutationResult<CreateCommunityData, CreateCommunityVariables>;
```

### Variables
The `CreateCommunity` Mutation requires an argument of type `CreateCommunityVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface CreateCommunityVariables {
  name: string;
  location: string;
  description?: string | null;
}
```
### Return Type
Recall that calling the `CreateCommunity` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateCommunity` Mutation is of type `CreateCommunityData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateCommunityData {
  community_insert: Community_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateCommunity`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateCommunityVariables } from '@dataconnect/generated';
import { useCreateCommunity } from '@dataconnect/generated/react'

export default function CreateCommunityComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateCommunity();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateCommunity(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateCommunity(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateCommunity(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateCommunity` Mutation requires an argument of type `CreateCommunityVariables`:
  const createCommunityVars: CreateCommunityVariables = {
    name: ..., 
    location: ..., 
    description: ..., // optional
  };
  mutation.mutate(createCommunityVars);
  // Variables can be defined inline as well.
  mutation.mutate({ name: ..., location: ..., description: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createCommunityVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.community_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateCommunity
You can execute the `UpdateCommunity` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateCommunity(options?: useDataConnectMutationOptions<UpdateCommunityData, FirebaseError, UpdateCommunityVariables>): UseDataConnectMutationResult<UpdateCommunityData, UpdateCommunityVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateCommunity(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateCommunityData, FirebaseError, UpdateCommunityVariables>): UseDataConnectMutationResult<UpdateCommunityData, UpdateCommunityVariables>;
```

### Variables
The `UpdateCommunity` Mutation requires an argument of type `UpdateCommunityVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface UpdateCommunityVariables {
  id: UUIDString;
  name?: string | null;
  location?: string | null;
  description?: string | null;
}
```
### Return Type
Recall that calling the `UpdateCommunity` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateCommunity` Mutation is of type `UpdateCommunityData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateCommunityData {
  community_update?: Community_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateCommunity`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateCommunityVariables } from '@dataconnect/generated';
import { useUpdateCommunity } from '@dataconnect/generated/react'

export default function UpdateCommunityComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateCommunity();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateCommunity(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateCommunity(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateCommunity(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateCommunity` Mutation requires an argument of type `UpdateCommunityVariables`:
  const updateCommunityVars: UpdateCommunityVariables = {
    id: ..., 
    name: ..., // optional
    location: ..., // optional
    description: ..., // optional
  };
  mutation.mutate(updateCommunityVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., name: ..., location: ..., description: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateCommunityVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.community_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteCommunity
You can execute the `DeleteCommunity` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [dataconnect-generated/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteCommunity(options?: useDataConnectMutationOptions<DeleteCommunityData, FirebaseError, DeleteCommunityVariables>): UseDataConnectMutationResult<DeleteCommunityData, DeleteCommunityVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteCommunity(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteCommunityData, FirebaseError, DeleteCommunityVariables>): UseDataConnectMutationResult<DeleteCommunityData, DeleteCommunityVariables>;
```

### Variables
The `DeleteCommunity` Mutation requires an argument of type `DeleteCommunityVariables`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteCommunityVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `DeleteCommunity` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteCommunity` Mutation is of type `DeleteCommunityData`, which is defined in [dataconnect-generated/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteCommunityData {
  community_delete?: Community_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteCommunity`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteCommunityVariables } from '@dataconnect/generated';
import { useDeleteCommunity } from '@dataconnect/generated/react'

export default function DeleteCommunityComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteCommunity();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteCommunity(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteCommunity(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteCommunity(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteCommunity` Mutation requires an argument of type `DeleteCommunityVariables`:
  const deleteCommunityVars: DeleteCommunityVariables = {
    id: ..., 
  };
  mutation.mutate(deleteCommunityVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteCommunityVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.community_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

