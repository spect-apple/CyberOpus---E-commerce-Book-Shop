package com.cyberopus.dto.response;

import java.time.LocalDateTime;

public record WishlistResponse(
        Long id,
        BookResponse book,
        LocalDateTime addedAt
) {}
