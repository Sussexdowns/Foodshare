# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.




### React
For each operation, there is a wrapper hook that can be used to call the operation.

Here are all of the hooks that get generated:
```ts
import { useCreateFoodItem, useUpdateFoodItem, useDeleteFoodItem, useUpdateFoodItemStatus, useUpsertUser, useUpdateUserProfile, useCreateRequest, useUpdateRequestStatus, useDeleteRequest, useCreateReview } from '@dataconnect/generated/react';
// The types of these hooks are available in react/index.d.ts

const { data, isPending, isSuccess, isError, error } = useCreateFoodItem(createFoodItemVars);

const { data, isPending, isSuccess, isError, error } = useUpdateFoodItem(updateFoodItemVars);

const { data, isPending, isSuccess, isError, error } = useDeleteFoodItem(deleteFoodItemVars);

const { data, isPending, isSuccess, isError, error } = useUpdateFoodItemStatus(updateFoodItemStatusVars);

const { data, isPending, isSuccess, isError, error } = useUpsertUser(upsertUserVars);

const { data, isPending, isSuccess, isError, error } = useUpdateUserProfile(updateUserProfileVars);

const { data, isPending, isSuccess, isError, error } = useCreateRequest(createRequestVars);

const { data, isPending, isSuccess, isError, error } = useUpdateRequestStatus(updateRequestStatusVars);

const { data, isPending, isSuccess, isError, error } = useDeleteRequest(deleteRequestVars);

const { data, isPending, isSuccess, isError, error } = useCreateReview(createReviewVars);

```

Here's an example from a different generated SDK:

```ts
import { useListAllMovies } from '@dataconnect/generated/react';

function MyComponent() {
  const { isLoading, data, error } = useListAllMovies();
  if(isLoading) {
    return <div>Loading...</div>
  }
  if(error) {
    return <div> An Error Occurred: {error} </div>
  }
}

// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyComponent from './my-component';

function App() {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>
    <MyComponent />
  </QueryClientProvider>
}
```



## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createFoodItem, updateFoodItem, deleteFoodItem, updateFoodItemStatus, upsertUser, updateUserProfile, createRequest, updateRequestStatus, deleteRequest, createReview } from '@dataconnect/generated';


// Operation CreateFoodItem:  For variables, look at type CreateFoodItemVars in ../index.d.ts
const { data } = await CreateFoodItem(dataConnect, createFoodItemVars);

// Operation UpdateFoodItem:  For variables, look at type UpdateFoodItemVars in ../index.d.ts
const { data } = await UpdateFoodItem(dataConnect, updateFoodItemVars);

// Operation DeleteFoodItem:  For variables, look at type DeleteFoodItemVars in ../index.d.ts
const { data } = await DeleteFoodItem(dataConnect, deleteFoodItemVars);

// Operation UpdateFoodItemStatus:  For variables, look at type UpdateFoodItemStatusVars in ../index.d.ts
const { data } = await UpdateFoodItemStatus(dataConnect, updateFoodItemStatusVars);

// Operation UpsertUser:  For variables, look at type UpsertUserVars in ../index.d.ts
const { data } = await UpsertUser(dataConnect, upsertUserVars);

// Operation UpdateUserProfile:  For variables, look at type UpdateUserProfileVars in ../index.d.ts
const { data } = await UpdateUserProfile(dataConnect, updateUserProfileVars);

// Operation CreateRequest:  For variables, look at type CreateRequestVars in ../index.d.ts
const { data } = await CreateRequest(dataConnect, createRequestVars);

// Operation UpdateRequestStatus:  For variables, look at type UpdateRequestStatusVars in ../index.d.ts
const { data } = await UpdateRequestStatus(dataConnect, updateRequestStatusVars);

// Operation DeleteRequest:  For variables, look at type DeleteRequestVars in ../index.d.ts
const { data } = await DeleteRequest(dataConnect, deleteRequestVars);

// Operation CreateReview:  For variables, look at type CreateReviewVars in ../index.d.ts
const { data } = await CreateReview(dataConnect, createReviewVars);


```