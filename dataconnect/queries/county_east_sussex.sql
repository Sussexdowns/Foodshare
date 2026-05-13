-- Food sources in East Sussex
-- Query file: east_sussex.sql
-- Generated for Foodshare Data Connect

SELECT
    s.source_id AS id,
    s.name,
    s.type,
    s.category,
    s.sub_category,
    s.lat,
    s.lng,
    s.short_description,
    s.season,
    s.image_url,
    s.source_link AS link,
    s.address,
    s.town,
    s.area,
    s.county,
    s.postcode,
    s.likes,
    s.dislikes,
    s.approved
FROM sources s
WHERE LOWER(s.county) = LOWER('East Sussex')
ORDER BY s.approved DESC, s.name ASC;
