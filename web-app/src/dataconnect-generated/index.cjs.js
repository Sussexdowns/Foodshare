const { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'foodshare',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const createFoodItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateFoodItem', inputVars);
}
createFoodItemRef.operationName = 'CreateFoodItem';
exports.createFoodItemRef = createFoodItemRef;

exports.createFoodItem = function createFoodItem(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createFoodItemRef(dcInstance, inputVars));
}
;

const updateFoodItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateFoodItem', inputVars);
}
updateFoodItemRef.operationName = 'UpdateFoodItem';
exports.updateFoodItemRef = updateFoodItemRef;

exports.updateFoodItem = function updateFoodItem(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateFoodItemRef(dcInstance, inputVars));
}
;

const deleteFoodItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteFoodItem', inputVars);
}
deleteFoodItemRef.operationName = 'DeleteFoodItem';
exports.deleteFoodItemRef = deleteFoodItemRef;

exports.deleteFoodItem = function deleteFoodItem(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteFoodItemRef(dcInstance, inputVars));
}
;

const updateFoodItemStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateFoodItemStatus', inputVars);
}
updateFoodItemStatusRef.operationName = 'UpdateFoodItemStatus';
exports.updateFoodItemStatusRef = updateFoodItemStatusRef;

exports.updateFoodItemStatus = function updateFoodItemStatus(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateFoodItemStatusRef(dcInstance, inputVars));
}
;

const upsertUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertUser', inputVars);
}
upsertUserRef.operationName = 'UpsertUser';
exports.upsertUserRef = upsertUserRef;

exports.upsertUser = function upsertUser(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertUserRef(dcInstance, inputVars));
}
;

const updateUserProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateUserProfile', inputVars);
}
updateUserProfileRef.operationName = 'UpdateUserProfile';
exports.updateUserProfileRef = updateUserProfileRef;

exports.updateUserProfile = function updateUserProfile(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars);
  return executeMutation(updateUserProfileRef(dcInstance, inputVars));
}
;

const createRequestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateRequest', inputVars);
}
createRequestRef.operationName = 'CreateRequest';
exports.createRequestRef = createRequestRef;

exports.createRequest = function createRequest(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createRequestRef(dcInstance, inputVars));
}
;

const updateRequestStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateRequestStatus', inputVars);
}
updateRequestStatusRef.operationName = 'UpdateRequestStatus';
exports.updateRequestStatusRef = updateRequestStatusRef;

exports.updateRequestStatus = function updateRequestStatus(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateRequestStatusRef(dcInstance, inputVars));
}
;

const deleteRequestRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteRequest', inputVars);
}
deleteRequestRef.operationName = 'DeleteRequest';
exports.deleteRequestRef = deleteRequestRef;

exports.deleteRequest = function deleteRequest(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteRequestRef(dcInstance, inputVars));
}
;

const createReviewRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateReview', inputVars);
}
createReviewRef.operationName = 'CreateReview';
exports.createReviewRef = createReviewRef;

exports.createReview = function createReview(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createReviewRef(dcInstance, inputVars));
}
;

const createCommunityRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateCommunity', inputVars);
}
createCommunityRef.operationName = 'CreateCommunity';
exports.createCommunityRef = createCommunityRef;

exports.createCommunity = function createCommunity(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createCommunityRef(dcInstance, inputVars));
}
;

const updateCommunityRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateCommunity', inputVars);
}
updateCommunityRef.operationName = 'UpdateCommunity';
exports.updateCommunityRef = updateCommunityRef;

exports.updateCommunity = function updateCommunity(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateCommunityRef(dcInstance, inputVars));
}
;

const deleteCommunityRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteCommunity', inputVars);
}
deleteCommunityRef.operationName = 'DeleteCommunity';
exports.deleteCommunityRef = deleteCommunityRef;

exports.deleteCommunity = function deleteCommunity(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteCommunityRef(dcInstance, inputVars));
}
;

const listFoodItemsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListFoodItems');
}
listFoodItemsRef.operationName = 'ListFoodItems';
exports.listFoodItemsRef = listFoodItemsRef;

exports.listFoodItems = function listFoodItems(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listFoodItemsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getFoodItemByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetFoodItemById', inputVars);
}
getFoodItemByIdRef.operationName = 'GetFoodItemById';
exports.getFoodItemByIdRef = getFoodItemByIdRef;

exports.getFoodItemById = function getFoodItemById(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getFoodItemByIdRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const searchFoodItemsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'SearchFoodItems', inputVars);
}
searchFoodItemsRef.operationName = 'SearchFoodItems';
exports.searchFoodItemsRef = searchFoodItemsRef;

exports.searchFoodItems = function searchFoodItems(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, false);
  return executeQuery(searchFoodItemsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listFoodItemsByCategoryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListFoodItemsByCategory', inputVars);
}
listFoodItemsByCategoryRef.operationName = 'ListFoodItemsByCategory';
exports.listFoodItemsByCategoryRef = listFoodItemsByCategoryRef;

exports.listFoodItemsByCategory = function listFoodItemsByCategory(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listFoodItemsByCategoryRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listFoodItemsByLocationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListFoodItemsByLocation', inputVars);
}
listFoodItemsByLocationRef.operationName = 'ListFoodItemsByLocation';
exports.listFoodItemsByLocationRef = listFoodItemsByLocationRef;

exports.listFoodItemsByLocation = function listFoodItemsByLocation(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, false);
  return executeQuery(listFoodItemsByLocationRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listFoodItemsInBoundsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListFoodItemsInBounds', inputVars);
}
listFoodItemsInBoundsRef.operationName = 'ListFoodItemsInBounds';
exports.listFoodItemsInBoundsRef = listFoodItemsInBoundsRef;

exports.listFoodItemsInBounds = function listFoodItemsInBounds(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listFoodItemsInBoundsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listMyFoodItemsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMyFoodItems');
}
listMyFoodItemsRef.operationName = 'ListMyFoodItems';
exports.listMyFoodItemsRef = listMyFoodItemsRef;

exports.listMyFoodItems = function listMyFoodItems(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listMyFoodItemsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listCommunitiesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListCommunities');
}
listCommunitiesRef.operationName = 'ListCommunities';
exports.listCommunitiesRef = listCommunitiesRef;

exports.listCommunities = function listCommunities(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listCommunitiesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getCommunityByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCommunityById', inputVars);
}
getCommunityByIdRef.operationName = 'GetCommunityById';
exports.getCommunityByIdRef = getCommunityByIdRef;

exports.getCommunityById = function getCommunityById(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getCommunityByIdRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listMyRequestsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMyRequests');
}
listMyRequestsRef.operationName = 'ListMyRequests';
exports.listMyRequestsRef = listMyRequestsRef;

exports.listMyRequests = function listMyRequests(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listMyRequestsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listUserReviewsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListUserReviews', inputVars);
}
listUserReviewsRef.operationName = 'ListUserReviews';
exports.listUserReviewsRef = listUserReviewsRef;

exports.listUserReviews = function listUserReviews(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listUserReviewsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;
