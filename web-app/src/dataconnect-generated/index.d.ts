import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Category_Key {
  categoryId: string;
  __typename?: 'Category_Key';
}

export interface Community_Key {
  id: UUIDString;
  __typename?: 'Community_Key';
}

export interface CreateCommunityData {
  community_insert: Community_Key;
}

export interface CreateCommunityVariables {
  name: string;
  location: string;
  description?: string | null;
}

export interface CreateFoodItemData {
  foodItem_insert: FoodItem_Key;
}

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

export interface CreateRequestData {
  request_insert: Request_Key;
}

export interface CreateRequestVariables {
  foodItemId: UUIDString;
  messageToDonor?: string | null;
}

export interface CreateReviewData {
  review_insert: Review_Key;
}

export interface CreateReviewVariables {
  reviewedUserId: UUIDString;
  requestId: UUIDString;
  rating: number;
  comment?: string | null;
}

export interface DeleteCommunityData {
  community_delete?: Community_Key | null;
}

export interface DeleteCommunityVariables {
  id: UUIDString;
}

export interface DeleteFoodItemData {
  foodItem_delete?: FoodItem_Key | null;
}

export interface DeleteFoodItemVariables {
  id: UUIDString;
}

export interface DeleteRequestData {
  request_delete?: Request_Key | null;
}

export interface DeleteRequestVariables {
  id: UUIDString;
}

export interface FoodItem_Key {
  id: UUIDString;
  __typename?: 'FoodItem_Key';
}

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

export interface GetCommunityByIdVariables {
  id: UUIDString;
}

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

export interface GetFoodItemByIdVariables {
  id: UUIDString;
}

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

export interface ListFoodItemsByCategoryVariables {
  category: string;
}

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

export interface ListFoodItemsByLocationVariables {
  town?: string | null;
  county?: string | null;
}

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

export interface ListFoodItemsInBoundsVariables {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

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

export interface ListUserReviewsVariables {
  userId: UUIDString;
}

export interface Location_Key {
  id: UUIDString;
  __typename?: 'Location_Key';
}

export interface Report_Key {
  id: UUIDString;
  __typename?: 'Report_Key';
}

export interface Request_Key {
  id: UUIDString;
  __typename?: 'Request_Key';
}

export interface Review_Key {
  id: UUIDString;
  __typename?: 'Review_Key';
}

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

export interface SearchFoodItemsVariables {
  category?: string | null;
  name?: string | null;
  status?: string | null;
}

export interface UpdateCommunityData {
  community_update?: Community_Key | null;
}

export interface UpdateCommunityVariables {
  id: UUIDString;
  name?: string | null;
  location?: string | null;
  description?: string | null;
}

export interface UpdateFoodItemData {
  foodItem_update?: FoodItem_Key | null;
}

export interface UpdateFoodItemStatusData {
  foodItem_update?: FoodItem_Key | null;
}

export interface UpdateFoodItemStatusVariables {
  id: UUIDString;
  status: string;
}

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

export interface UpdateRequestStatusData {
  request_update?: Request_Key | null;
}

export interface UpdateRequestStatusVariables {
  id: UUIDString;
  status: string;
}

export interface UpdateUserProfileData {
  user_update?: User_Key | null;
}

export interface UpdateUserProfileVariables {
  displayName?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  bio?: string | null;
  profilePictureUrl?: string | null;
}

export interface UpsertUserData {
  user_upsert: User_Key;
}

export interface UpsertUserVariables {
  displayName: string;
  email: string;
  userType: string;
  phoneNumber?: string | null;
  address?: string | null;
  bio?: string | null;
  profilePictureUrl?: string | null;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateFoodItemRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateFoodItemVariables): MutationRef<CreateFoodItemData, CreateFoodItemVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateFoodItemVariables): MutationRef<CreateFoodItemData, CreateFoodItemVariables>;
  operationName: string;
}
export const createFoodItemRef: CreateFoodItemRef;

export function createFoodItem(vars: CreateFoodItemVariables): MutationPromise<CreateFoodItemData, CreateFoodItemVariables>;
export function createFoodItem(dc: DataConnect, vars: CreateFoodItemVariables): MutationPromise<CreateFoodItemData, CreateFoodItemVariables>;

interface UpdateFoodItemRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateFoodItemVariables): MutationRef<UpdateFoodItemData, UpdateFoodItemVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateFoodItemVariables): MutationRef<UpdateFoodItemData, UpdateFoodItemVariables>;
  operationName: string;
}
export const updateFoodItemRef: UpdateFoodItemRef;

export function updateFoodItem(vars: UpdateFoodItemVariables): MutationPromise<UpdateFoodItemData, UpdateFoodItemVariables>;
export function updateFoodItem(dc: DataConnect, vars: UpdateFoodItemVariables): MutationPromise<UpdateFoodItemData, UpdateFoodItemVariables>;

interface DeleteFoodItemRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteFoodItemVariables): MutationRef<DeleteFoodItemData, DeleteFoodItemVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteFoodItemVariables): MutationRef<DeleteFoodItemData, DeleteFoodItemVariables>;
  operationName: string;
}
export const deleteFoodItemRef: DeleteFoodItemRef;

export function deleteFoodItem(vars: DeleteFoodItemVariables): MutationPromise<DeleteFoodItemData, DeleteFoodItemVariables>;
export function deleteFoodItem(dc: DataConnect, vars: DeleteFoodItemVariables): MutationPromise<DeleteFoodItemData, DeleteFoodItemVariables>;

interface UpdateFoodItemStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateFoodItemStatusVariables): MutationRef<UpdateFoodItemStatusData, UpdateFoodItemStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateFoodItemStatusVariables): MutationRef<UpdateFoodItemStatusData, UpdateFoodItemStatusVariables>;
  operationName: string;
}
export const updateFoodItemStatusRef: UpdateFoodItemStatusRef;

export function updateFoodItemStatus(vars: UpdateFoodItemStatusVariables): MutationPromise<UpdateFoodItemStatusData, UpdateFoodItemStatusVariables>;
export function updateFoodItemStatus(dc: DataConnect, vars: UpdateFoodItemStatusVariables): MutationPromise<UpdateFoodItemStatusData, UpdateFoodItemStatusVariables>;

interface UpsertUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertUserVariables): MutationRef<UpsertUserData, UpsertUserVariables>;
  operationName: string;
}
export const upsertUserRef: UpsertUserRef;

export function upsertUser(vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;
export function upsertUser(dc: DataConnect, vars: UpsertUserVariables): MutationPromise<UpsertUserData, UpsertUserVariables>;

interface UpdateUserProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpdateUserProfileVariables): MutationRef<UpdateUserProfileData, UpdateUserProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: UpdateUserProfileVariables): MutationRef<UpdateUserProfileData, UpdateUserProfileVariables>;
  operationName: string;
}
export const updateUserProfileRef: UpdateUserProfileRef;

export function updateUserProfile(vars?: UpdateUserProfileVariables): MutationPromise<UpdateUserProfileData, UpdateUserProfileVariables>;
export function updateUserProfile(dc: DataConnect, vars?: UpdateUserProfileVariables): MutationPromise<UpdateUserProfileData, UpdateUserProfileVariables>;

interface CreateRequestRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateRequestVariables): MutationRef<CreateRequestData, CreateRequestVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateRequestVariables): MutationRef<CreateRequestData, CreateRequestVariables>;
  operationName: string;
}
export const createRequestRef: CreateRequestRef;

export function createRequest(vars: CreateRequestVariables): MutationPromise<CreateRequestData, CreateRequestVariables>;
export function createRequest(dc: DataConnect, vars: CreateRequestVariables): MutationPromise<CreateRequestData, CreateRequestVariables>;

interface UpdateRequestStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateRequestStatusVariables): MutationRef<UpdateRequestStatusData, UpdateRequestStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateRequestStatusVariables): MutationRef<UpdateRequestStatusData, UpdateRequestStatusVariables>;
  operationName: string;
}
export const updateRequestStatusRef: UpdateRequestStatusRef;

export function updateRequestStatus(vars: UpdateRequestStatusVariables): MutationPromise<UpdateRequestStatusData, UpdateRequestStatusVariables>;
export function updateRequestStatus(dc: DataConnect, vars: UpdateRequestStatusVariables): MutationPromise<UpdateRequestStatusData, UpdateRequestStatusVariables>;

interface DeleteRequestRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteRequestVariables): MutationRef<DeleteRequestData, DeleteRequestVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteRequestVariables): MutationRef<DeleteRequestData, DeleteRequestVariables>;
  operationName: string;
}
export const deleteRequestRef: DeleteRequestRef;

export function deleteRequest(vars: DeleteRequestVariables): MutationPromise<DeleteRequestData, DeleteRequestVariables>;
export function deleteRequest(dc: DataConnect, vars: DeleteRequestVariables): MutationPromise<DeleteRequestData, DeleteRequestVariables>;

interface CreateReviewRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateReviewVariables): MutationRef<CreateReviewData, CreateReviewVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateReviewVariables): MutationRef<CreateReviewData, CreateReviewVariables>;
  operationName: string;
}
export const createReviewRef: CreateReviewRef;

export function createReview(vars: CreateReviewVariables): MutationPromise<CreateReviewData, CreateReviewVariables>;
export function createReview(dc: DataConnect, vars: CreateReviewVariables): MutationPromise<CreateReviewData, CreateReviewVariables>;

interface CreateCommunityRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCommunityVariables): MutationRef<CreateCommunityData, CreateCommunityVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateCommunityVariables): MutationRef<CreateCommunityData, CreateCommunityVariables>;
  operationName: string;
}
export const createCommunityRef: CreateCommunityRef;

export function createCommunity(vars: CreateCommunityVariables): MutationPromise<CreateCommunityData, CreateCommunityVariables>;
export function createCommunity(dc: DataConnect, vars: CreateCommunityVariables): MutationPromise<CreateCommunityData, CreateCommunityVariables>;

interface UpdateCommunityRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateCommunityVariables): MutationRef<UpdateCommunityData, UpdateCommunityVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateCommunityVariables): MutationRef<UpdateCommunityData, UpdateCommunityVariables>;
  operationName: string;
}
export const updateCommunityRef: UpdateCommunityRef;

export function updateCommunity(vars: UpdateCommunityVariables): MutationPromise<UpdateCommunityData, UpdateCommunityVariables>;
export function updateCommunity(dc: DataConnect, vars: UpdateCommunityVariables): MutationPromise<UpdateCommunityData, UpdateCommunityVariables>;

interface DeleteCommunityRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteCommunityVariables): MutationRef<DeleteCommunityData, DeleteCommunityVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteCommunityVariables): MutationRef<DeleteCommunityData, DeleteCommunityVariables>;
  operationName: string;
}
export const deleteCommunityRef: DeleteCommunityRef;

export function deleteCommunity(vars: DeleteCommunityVariables): MutationPromise<DeleteCommunityData, DeleteCommunityVariables>;
export function deleteCommunity(dc: DataConnect, vars: DeleteCommunityVariables): MutationPromise<DeleteCommunityData, DeleteCommunityVariables>;

interface ListFoodItemsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListFoodItemsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListFoodItemsData, undefined>;
  operationName: string;
}
export const listFoodItemsRef: ListFoodItemsRef;

export function listFoodItems(options?: ExecuteQueryOptions): QueryPromise<ListFoodItemsData, undefined>;
export function listFoodItems(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListFoodItemsData, undefined>;

interface GetFoodItemByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetFoodItemByIdVariables): QueryRef<GetFoodItemByIdData, GetFoodItemByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetFoodItemByIdVariables): QueryRef<GetFoodItemByIdData, GetFoodItemByIdVariables>;
  operationName: string;
}
export const getFoodItemByIdRef: GetFoodItemByIdRef;

export function getFoodItemById(vars: GetFoodItemByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetFoodItemByIdData, GetFoodItemByIdVariables>;
export function getFoodItemById(dc: DataConnect, vars: GetFoodItemByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetFoodItemByIdData, GetFoodItemByIdVariables>;

interface SearchFoodItemsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: SearchFoodItemsVariables): QueryRef<SearchFoodItemsData, SearchFoodItemsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: SearchFoodItemsVariables): QueryRef<SearchFoodItemsData, SearchFoodItemsVariables>;
  operationName: string;
}
export const searchFoodItemsRef: SearchFoodItemsRef;

export function searchFoodItems(vars?: SearchFoodItemsVariables, options?: ExecuteQueryOptions): QueryPromise<SearchFoodItemsData, SearchFoodItemsVariables>;
export function searchFoodItems(dc: DataConnect, vars?: SearchFoodItemsVariables, options?: ExecuteQueryOptions): QueryPromise<SearchFoodItemsData, SearchFoodItemsVariables>;

interface ListFoodItemsByCategoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListFoodItemsByCategoryVariables): QueryRef<ListFoodItemsByCategoryData, ListFoodItemsByCategoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListFoodItemsByCategoryVariables): QueryRef<ListFoodItemsByCategoryData, ListFoodItemsByCategoryVariables>;
  operationName: string;
}
export const listFoodItemsByCategoryRef: ListFoodItemsByCategoryRef;

export function listFoodItemsByCategory(vars: ListFoodItemsByCategoryVariables, options?: ExecuteQueryOptions): QueryPromise<ListFoodItemsByCategoryData, ListFoodItemsByCategoryVariables>;
export function listFoodItemsByCategory(dc: DataConnect, vars: ListFoodItemsByCategoryVariables, options?: ExecuteQueryOptions): QueryPromise<ListFoodItemsByCategoryData, ListFoodItemsByCategoryVariables>;

interface ListFoodItemsByLocationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListFoodItemsByLocationVariables): QueryRef<ListFoodItemsByLocationData, ListFoodItemsByLocationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: ListFoodItemsByLocationVariables): QueryRef<ListFoodItemsByLocationData, ListFoodItemsByLocationVariables>;
  operationName: string;
}
export const listFoodItemsByLocationRef: ListFoodItemsByLocationRef;

export function listFoodItemsByLocation(vars?: ListFoodItemsByLocationVariables, options?: ExecuteQueryOptions): QueryPromise<ListFoodItemsByLocationData, ListFoodItemsByLocationVariables>;
export function listFoodItemsByLocation(dc: DataConnect, vars?: ListFoodItemsByLocationVariables, options?: ExecuteQueryOptions): QueryPromise<ListFoodItemsByLocationData, ListFoodItemsByLocationVariables>;

interface ListFoodItemsInBoundsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListFoodItemsInBoundsVariables): QueryRef<ListFoodItemsInBoundsData, ListFoodItemsInBoundsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListFoodItemsInBoundsVariables): QueryRef<ListFoodItemsInBoundsData, ListFoodItemsInBoundsVariables>;
  operationName: string;
}
export const listFoodItemsInBoundsRef: ListFoodItemsInBoundsRef;

export function listFoodItemsInBounds(vars: ListFoodItemsInBoundsVariables, options?: ExecuteQueryOptions): QueryPromise<ListFoodItemsInBoundsData, ListFoodItemsInBoundsVariables>;
export function listFoodItemsInBounds(dc: DataConnect, vars: ListFoodItemsInBoundsVariables, options?: ExecuteQueryOptions): QueryPromise<ListFoodItemsInBoundsData, ListFoodItemsInBoundsVariables>;

interface ListMyFoodItemsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyFoodItemsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMyFoodItemsData, undefined>;
  operationName: string;
}
export const listMyFoodItemsRef: ListMyFoodItemsRef;

export function listMyFoodItems(options?: ExecuteQueryOptions): QueryPromise<ListMyFoodItemsData, undefined>;
export function listMyFoodItems(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyFoodItemsData, undefined>;

interface ListCommunitiesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListCommunitiesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListCommunitiesData, undefined>;
  operationName: string;
}
export const listCommunitiesRef: ListCommunitiesRef;

export function listCommunities(options?: ExecuteQueryOptions): QueryPromise<ListCommunitiesData, undefined>;
export function listCommunities(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListCommunitiesData, undefined>;

interface GetCommunityByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCommunityByIdVariables): QueryRef<GetCommunityByIdData, GetCommunityByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetCommunityByIdVariables): QueryRef<GetCommunityByIdData, GetCommunityByIdVariables>;
  operationName: string;
}
export const getCommunityByIdRef: GetCommunityByIdRef;

export function getCommunityById(vars: GetCommunityByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetCommunityByIdData, GetCommunityByIdVariables>;
export function getCommunityById(dc: DataConnect, vars: GetCommunityByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetCommunityByIdData, GetCommunityByIdVariables>;

interface ListMyRequestsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyRequestsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMyRequestsData, undefined>;
  operationName: string;
}
export const listMyRequestsRef: ListMyRequestsRef;

export function listMyRequests(options?: ExecuteQueryOptions): QueryPromise<ListMyRequestsData, undefined>;
export function listMyRequests(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyRequestsData, undefined>;

interface ListUserReviewsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListUserReviewsVariables): QueryRef<ListUserReviewsData, ListUserReviewsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListUserReviewsVariables): QueryRef<ListUserReviewsData, ListUserReviewsVariables>;
  operationName: string;
}
export const listUserReviewsRef: ListUserReviewsRef;

export function listUserReviews(vars: ListUserReviewsVariables, options?: ExecuteQueryOptions): QueryPromise<ListUserReviewsData, ListUserReviewsVariables>;
export function listUserReviews(dc: DataConnect, vars: ListUserReviewsVariables, options?: ExecuteQueryOptions): QueryPromise<ListUserReviewsData, ListUserReviewsVariables>;

