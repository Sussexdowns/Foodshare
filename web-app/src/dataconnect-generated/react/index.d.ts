import { CreateFoodItemData, CreateFoodItemVariables, UpdateFoodItemData, UpdateFoodItemVariables, DeleteFoodItemData, DeleteFoodItemVariables, UpdateFoodItemStatusData, UpdateFoodItemStatusVariables, UpsertUserData, UpsertUserVariables, UpdateUserProfileData, UpdateUserProfileVariables, CreateRequestData, CreateRequestVariables, UpdateRequestStatusData, UpdateRequestStatusVariables, DeleteRequestData, DeleteRequestVariables, CreateReviewData, CreateReviewVariables, CreateCommunityData, CreateCommunityVariables, UpdateCommunityData, UpdateCommunityVariables, DeleteCommunityData, DeleteCommunityVariables, ListFoodItemsData, GetFoodItemByIdData, GetFoodItemByIdVariables, SearchFoodItemsData, SearchFoodItemsVariables, ListFoodItemsByCategoryData, ListFoodItemsByCategoryVariables, ListFoodItemsByLocationData, ListFoodItemsByLocationVariables, ListFoodItemsInBoundsData, ListFoodItemsInBoundsVariables, ListMyFoodItemsData, ListCommunitiesData, GetCommunityByIdData, GetCommunityByIdVariables, ListMyRequestsData, ListUserReviewsData, ListUserReviewsVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateFoodItem(options?: useDataConnectMutationOptions<CreateFoodItemData, FirebaseError, CreateFoodItemVariables>): UseDataConnectMutationResult<CreateFoodItemData, CreateFoodItemVariables>;
export function useCreateFoodItem(dc: DataConnect, options?: useDataConnectMutationOptions<CreateFoodItemData, FirebaseError, CreateFoodItemVariables>): UseDataConnectMutationResult<CreateFoodItemData, CreateFoodItemVariables>;

export function useUpdateFoodItem(options?: useDataConnectMutationOptions<UpdateFoodItemData, FirebaseError, UpdateFoodItemVariables>): UseDataConnectMutationResult<UpdateFoodItemData, UpdateFoodItemVariables>;
export function useUpdateFoodItem(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateFoodItemData, FirebaseError, UpdateFoodItemVariables>): UseDataConnectMutationResult<UpdateFoodItemData, UpdateFoodItemVariables>;

export function useDeleteFoodItem(options?: useDataConnectMutationOptions<DeleteFoodItemData, FirebaseError, DeleteFoodItemVariables>): UseDataConnectMutationResult<DeleteFoodItemData, DeleteFoodItemVariables>;
export function useDeleteFoodItem(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteFoodItemData, FirebaseError, DeleteFoodItemVariables>): UseDataConnectMutationResult<DeleteFoodItemData, DeleteFoodItemVariables>;

export function useUpdateFoodItemStatus(options?: useDataConnectMutationOptions<UpdateFoodItemStatusData, FirebaseError, UpdateFoodItemStatusVariables>): UseDataConnectMutationResult<UpdateFoodItemStatusData, UpdateFoodItemStatusVariables>;
export function useUpdateFoodItemStatus(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateFoodItemStatusData, FirebaseError, UpdateFoodItemStatusVariables>): UseDataConnectMutationResult<UpdateFoodItemStatusData, UpdateFoodItemStatusVariables>;

export function useUpsertUser(options?: useDataConnectMutationOptions<UpsertUserData, FirebaseError, UpsertUserVariables>): UseDataConnectMutationResult<UpsertUserData, UpsertUserVariables>;
export function useUpsertUser(dc: DataConnect, options?: useDataConnectMutationOptions<UpsertUserData, FirebaseError, UpsertUserVariables>): UseDataConnectMutationResult<UpsertUserData, UpsertUserVariables>;

export function useUpdateUserProfile(options?: useDataConnectMutationOptions<UpdateUserProfileData, FirebaseError, UpdateUserProfileVariables | void>): UseDataConnectMutationResult<UpdateUserProfileData, UpdateUserProfileVariables>;
export function useUpdateUserProfile(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateUserProfileData, FirebaseError, UpdateUserProfileVariables | void>): UseDataConnectMutationResult<UpdateUserProfileData, UpdateUserProfileVariables>;

export function useCreateRequest(options?: useDataConnectMutationOptions<CreateRequestData, FirebaseError, CreateRequestVariables>): UseDataConnectMutationResult<CreateRequestData, CreateRequestVariables>;
export function useCreateRequest(dc: DataConnect, options?: useDataConnectMutationOptions<CreateRequestData, FirebaseError, CreateRequestVariables>): UseDataConnectMutationResult<CreateRequestData, CreateRequestVariables>;

export function useUpdateRequestStatus(options?: useDataConnectMutationOptions<UpdateRequestStatusData, FirebaseError, UpdateRequestStatusVariables>): UseDataConnectMutationResult<UpdateRequestStatusData, UpdateRequestStatusVariables>;
export function useUpdateRequestStatus(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateRequestStatusData, FirebaseError, UpdateRequestStatusVariables>): UseDataConnectMutationResult<UpdateRequestStatusData, UpdateRequestStatusVariables>;

export function useDeleteRequest(options?: useDataConnectMutationOptions<DeleteRequestData, FirebaseError, DeleteRequestVariables>): UseDataConnectMutationResult<DeleteRequestData, DeleteRequestVariables>;
export function useDeleteRequest(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteRequestData, FirebaseError, DeleteRequestVariables>): UseDataConnectMutationResult<DeleteRequestData, DeleteRequestVariables>;

export function useCreateReview(options?: useDataConnectMutationOptions<CreateReviewData, FirebaseError, CreateReviewVariables>): UseDataConnectMutationResult<CreateReviewData, CreateReviewVariables>;
export function useCreateReview(dc: DataConnect, options?: useDataConnectMutationOptions<CreateReviewData, FirebaseError, CreateReviewVariables>): UseDataConnectMutationResult<CreateReviewData, CreateReviewVariables>;

export function useCreateCommunity(options?: useDataConnectMutationOptions<CreateCommunityData, FirebaseError, CreateCommunityVariables>): UseDataConnectMutationResult<CreateCommunityData, CreateCommunityVariables>;
export function useCreateCommunity(dc: DataConnect, options?: useDataConnectMutationOptions<CreateCommunityData, FirebaseError, CreateCommunityVariables>): UseDataConnectMutationResult<CreateCommunityData, CreateCommunityVariables>;

export function useUpdateCommunity(options?: useDataConnectMutationOptions<UpdateCommunityData, FirebaseError, UpdateCommunityVariables>): UseDataConnectMutationResult<UpdateCommunityData, UpdateCommunityVariables>;
export function useUpdateCommunity(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateCommunityData, FirebaseError, UpdateCommunityVariables>): UseDataConnectMutationResult<UpdateCommunityData, UpdateCommunityVariables>;

export function useDeleteCommunity(options?: useDataConnectMutationOptions<DeleteCommunityData, FirebaseError, DeleteCommunityVariables>): UseDataConnectMutationResult<DeleteCommunityData, DeleteCommunityVariables>;
export function useDeleteCommunity(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteCommunityData, FirebaseError, DeleteCommunityVariables>): UseDataConnectMutationResult<DeleteCommunityData, DeleteCommunityVariables>;

export function useListFoodItems(options?: useDataConnectQueryOptions<ListFoodItemsData>): UseDataConnectQueryResult<ListFoodItemsData, undefined>;
export function useListFoodItems(dc: DataConnect, options?: useDataConnectQueryOptions<ListFoodItemsData>): UseDataConnectQueryResult<ListFoodItemsData, undefined>;

export function useGetFoodItemById(vars: GetFoodItemByIdVariables, options?: useDataConnectQueryOptions<GetFoodItemByIdData>): UseDataConnectQueryResult<GetFoodItemByIdData, GetFoodItemByIdVariables>;
export function useGetFoodItemById(dc: DataConnect, vars: GetFoodItemByIdVariables, options?: useDataConnectQueryOptions<GetFoodItemByIdData>): UseDataConnectQueryResult<GetFoodItemByIdData, GetFoodItemByIdVariables>;

export function useSearchFoodItems(vars?: SearchFoodItemsVariables, options?: useDataConnectQueryOptions<SearchFoodItemsData>): UseDataConnectQueryResult<SearchFoodItemsData, SearchFoodItemsVariables>;
export function useSearchFoodItems(dc: DataConnect, vars?: SearchFoodItemsVariables, options?: useDataConnectQueryOptions<SearchFoodItemsData>): UseDataConnectQueryResult<SearchFoodItemsData, SearchFoodItemsVariables>;

export function useListFoodItemsByCategory(vars: ListFoodItemsByCategoryVariables, options?: useDataConnectQueryOptions<ListFoodItemsByCategoryData>): UseDataConnectQueryResult<ListFoodItemsByCategoryData, ListFoodItemsByCategoryVariables>;
export function useListFoodItemsByCategory(dc: DataConnect, vars: ListFoodItemsByCategoryVariables, options?: useDataConnectQueryOptions<ListFoodItemsByCategoryData>): UseDataConnectQueryResult<ListFoodItemsByCategoryData, ListFoodItemsByCategoryVariables>;

export function useListFoodItemsByLocation(vars?: ListFoodItemsByLocationVariables, options?: useDataConnectQueryOptions<ListFoodItemsByLocationData>): UseDataConnectQueryResult<ListFoodItemsByLocationData, ListFoodItemsByLocationVariables>;
export function useListFoodItemsByLocation(dc: DataConnect, vars?: ListFoodItemsByLocationVariables, options?: useDataConnectQueryOptions<ListFoodItemsByLocationData>): UseDataConnectQueryResult<ListFoodItemsByLocationData, ListFoodItemsByLocationVariables>;

export function useListFoodItemsInBounds(vars: ListFoodItemsInBoundsVariables, options?: useDataConnectQueryOptions<ListFoodItemsInBoundsData>): UseDataConnectQueryResult<ListFoodItemsInBoundsData, ListFoodItemsInBoundsVariables>;
export function useListFoodItemsInBounds(dc: DataConnect, vars: ListFoodItemsInBoundsVariables, options?: useDataConnectQueryOptions<ListFoodItemsInBoundsData>): UseDataConnectQueryResult<ListFoodItemsInBoundsData, ListFoodItemsInBoundsVariables>;

export function useListMyFoodItems(options?: useDataConnectQueryOptions<ListMyFoodItemsData>): UseDataConnectQueryResult<ListMyFoodItemsData, undefined>;
export function useListMyFoodItems(dc: DataConnect, options?: useDataConnectQueryOptions<ListMyFoodItemsData>): UseDataConnectQueryResult<ListMyFoodItemsData, undefined>;

export function useListCommunities(options?: useDataConnectQueryOptions<ListCommunitiesData>): UseDataConnectQueryResult<ListCommunitiesData, undefined>;
export function useListCommunities(dc: DataConnect, options?: useDataConnectQueryOptions<ListCommunitiesData>): UseDataConnectQueryResult<ListCommunitiesData, undefined>;

export function useGetCommunityById(vars: GetCommunityByIdVariables, options?: useDataConnectQueryOptions<GetCommunityByIdData>): UseDataConnectQueryResult<GetCommunityByIdData, GetCommunityByIdVariables>;
export function useGetCommunityById(dc: DataConnect, vars: GetCommunityByIdVariables, options?: useDataConnectQueryOptions<GetCommunityByIdData>): UseDataConnectQueryResult<GetCommunityByIdData, GetCommunityByIdVariables>;

export function useListMyRequests(options?: useDataConnectQueryOptions<ListMyRequestsData>): UseDataConnectQueryResult<ListMyRequestsData, undefined>;
export function useListMyRequests(dc: DataConnect, options?: useDataConnectQueryOptions<ListMyRequestsData>): UseDataConnectQueryResult<ListMyRequestsData, undefined>;

export function useListUserReviews(vars: ListUserReviewsVariables, options?: useDataConnectQueryOptions<ListUserReviewsData>): UseDataConnectQueryResult<ListUserReviewsData, ListUserReviewsVariables>;
export function useListUserReviews(dc: DataConnect, vars: ListUserReviewsVariables, options?: useDataConnectQueryOptions<ListUserReviewsData>): UseDataConnectQueryResult<ListUserReviewsData, ListUserReviewsVariables>;
