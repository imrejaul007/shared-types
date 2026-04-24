import { z } from 'zod';
export declare const PRODUCT_TYPE: z.ZodEnum<["product", "service"]>;
export declare const PRODUCT_VISIBILITY: z.ZodEnum<["public", "hidden", "featured"]>;
export declare const TAX_SLAB: z.ZodEnum<["0", "5", "12", "18", "28", "exempt"]>;
export declare const MENU_PERIOD: z.ZodEnum<["all_day", "breakfast", "lunch", "dinner", "custom"]>;
export declare const ProductImageSchema: z.ZodObject<{
    url: z.ZodString;
    alt: z.ZodOptional<z.ZodString>;
    isPrimary: z.ZodOptional<z.ZodBoolean>;
}, "strict", z.ZodTypeAny, {
    url: string;
    alt?: string | undefined;
    isPrimary?: boolean | undefined;
}, {
    url: string;
    alt?: string | undefined;
    isPrimary?: boolean | undefined;
}>;
export declare const ProductGSTSchema: z.ZodObject<{
    hsnCode: z.ZodOptional<z.ZodString>;
    sacCode: z.ZodOptional<z.ZodString>;
    gstRate: z.ZodOptional<z.ZodNumber>;
    taxSlab: z.ZodOptional<z.ZodEnum<["0", "5", "12", "18", "28", "exempt"]>>;
    isIGST: z.ZodOptional<z.ZodBoolean>;
}, "strict", z.ZodTypeAny, {
    hsnCode?: string | undefined;
    sacCode?: string | undefined;
    gstRate?: number | undefined;
    taxSlab?: "0" | "5" | "12" | "18" | "28" | "exempt" | undefined;
    isIGST?: boolean | undefined;
}, {
    hsnCode?: string | undefined;
    sacCode?: string | undefined;
    gstRate?: number | undefined;
    taxSlab?: "0" | "5" | "12" | "18" | "28" | "exempt" | undefined;
    isIGST?: boolean | undefined;
}>;
export declare const ProductPricingSchema: z.ZodEffects<z.ZodObject<{
    original: z.ZodNumber;
    selling: z.ZodNumber;
    discount: z.ZodOptional<z.ZodNumber>;
    currency: z.ZodDefault<z.ZodString>;
    bulk: z.ZodOptional<z.ZodArray<z.ZodObject<{
        minQuantity: z.ZodNumber;
        price: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        price: number;
        minQuantity: number;
    }, {
        price: number;
        minQuantity: number;
    }>, "many">>;
    gst: z.ZodOptional<z.ZodObject<{
        hsnCode: z.ZodOptional<z.ZodString>;
        sacCode: z.ZodOptional<z.ZodString>;
        gstRate: z.ZodOptional<z.ZodNumber>;
        taxSlab: z.ZodOptional<z.ZodEnum<["0", "5", "12", "18", "28", "exempt"]>>;
        isIGST: z.ZodOptional<z.ZodBoolean>;
    }, "strict", z.ZodTypeAny, {
        hsnCode?: string | undefined;
        sacCode?: string | undefined;
        gstRate?: number | undefined;
        taxSlab?: "0" | "5" | "12" | "18" | "28" | "exempt" | undefined;
        isIGST?: boolean | undefined;
    }, {
        hsnCode?: string | undefined;
        sacCode?: string | undefined;
        gstRate?: number | undefined;
        taxSlab?: "0" | "5" | "12" | "18" | "28" | "exempt" | undefined;
        isIGST?: boolean | undefined;
    }>>;
}, "strict", z.ZodTypeAny, {
    selling: number;
    original: number;
    currency: string;
    discount?: number | undefined;
    bulk?: {
        price: number;
        minQuantity: number;
    }[] | undefined;
    gst?: {
        hsnCode?: string | undefined;
        sacCode?: string | undefined;
        gstRate?: number | undefined;
        taxSlab?: "0" | "5" | "12" | "18" | "28" | "exempt" | undefined;
        isIGST?: boolean | undefined;
    } | undefined;
}, {
    selling: number;
    original: number;
    discount?: number | undefined;
    currency?: string | undefined;
    bulk?: {
        price: number;
        minQuantity: number;
    }[] | undefined;
    gst?: {
        hsnCode?: string | undefined;
        sacCode?: string | undefined;
        gstRate?: number | undefined;
        taxSlab?: "0" | "5" | "12" | "18" | "28" | "exempt" | undefined;
        isIGST?: boolean | undefined;
    } | undefined;
}>, {
    selling: number;
    original: number;
    currency: string;
    discount?: number | undefined;
    bulk?: {
        price: number;
        minQuantity: number;
    }[] | undefined;
    gst?: {
        hsnCode?: string | undefined;
        sacCode?: string | undefined;
        gstRate?: number | undefined;
        taxSlab?: "0" | "5" | "12" | "18" | "28" | "exempt" | undefined;
        isIGST?: boolean | undefined;
    } | undefined;
}, {
    selling: number;
    original: number;
    discount?: number | undefined;
    currency?: string | undefined;
    bulk?: {
        price: number;
        minQuantity: number;
    }[] | undefined;
    gst?: {
        hsnCode?: string | undefined;
        sacCode?: string | undefined;
        gstRate?: number | undefined;
        taxSlab?: "0" | "5" | "12" | "18" | "28" | "exempt" | undefined;
        isIGST?: boolean | undefined;
    } | undefined;
}>;
export declare const ProductRatingDistributionSchema: z.ZodObject<{
    5: z.ZodNumber;
    4: z.ZodNumber;
    3: z.ZodNumber;
    2: z.ZodNumber;
    1: z.ZodNumber;
}, "strict", z.ZodTypeAny, {
    2: number;
    3: number;
    1: number;
    4: number;
    5: number;
}, {
    2: number;
    3: number;
    1: number;
    4: number;
    5: number;
}>;
export declare const ProductRatingSchema: z.ZodObject<{
    average: z.ZodNumber;
    count: z.ZodNumber;
    distribution: z.ZodObject<{
        5: z.ZodNumber;
        4: z.ZodNumber;
        3: z.ZodNumber;
        2: z.ZodNumber;
        1: z.ZodNumber;
    }, "strict", z.ZodTypeAny, {
        2: number;
        3: number;
        1: number;
        4: number;
        5: number;
    }, {
        2: number;
        3: number;
        1: number;
        4: number;
        5: number;
    }>;
}, "strict", z.ZodTypeAny, {
    average: number;
    count: number;
    distribution: {
        2: number;
        3: number;
        1: number;
        4: number;
        5: number;
    };
}, {
    average: number;
    count: number;
    distribution: {
        2: number;
        3: number;
        1: number;
        4: number;
        5: number;
    };
}>;
export declare const ProductVariantSchema: z.ZodObject<{
    variantId: z.ZodString;
    type: z.ZodString;
    value: z.ZodString;
    attributes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    price: z.ZodOptional<z.ZodNumber>;
    compareAtPrice: z.ZodOptional<z.ZodNumber>;
    stock: z.ZodNumber;
    sku: z.ZodOptional<z.ZodString>;
    images: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    barcode: z.ZodOptional<z.ZodString>;
    weight: z.ZodOptional<z.ZodNumber>;
    isAvailable: z.ZodOptional<z.ZodBoolean>;
}, "strict", z.ZodTypeAny, {
    value: string;
    type: string;
    variantId: string;
    stock: number;
    sku?: string | undefined;
    price?: number | undefined;
    attributes?: Record<string, string> | undefined;
    compareAtPrice?: number | undefined;
    images?: string[] | undefined;
    barcode?: string | undefined;
    weight?: number | undefined;
    isAvailable?: boolean | undefined;
}, {
    value: string;
    type: string;
    variantId: string;
    stock: number;
    sku?: string | undefined;
    price?: number | undefined;
    attributes?: Record<string, string> | undefined;
    compareAtPrice?: number | undefined;
    images?: string[] | undefined;
    barcode?: string | undefined;
    weight?: number | undefined;
    isAvailable?: boolean | undefined;
}>;
export declare const ProductInventorySchema: z.ZodObject<{
    stock: z.ZodNumber;
    isAvailable: z.ZodBoolean;
    lowStockThreshold: z.ZodOptional<z.ZodNumber>;
    variants: z.ZodOptional<z.ZodArray<z.ZodObject<{
        variantId: z.ZodString;
        type: z.ZodString;
        value: z.ZodString;
        attributes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
        price: z.ZodOptional<z.ZodNumber>;
        compareAtPrice: z.ZodOptional<z.ZodNumber>;
        stock: z.ZodNumber;
        sku: z.ZodOptional<z.ZodString>;
        images: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        barcode: z.ZodOptional<z.ZodString>;
        weight: z.ZodOptional<z.ZodNumber>;
        isAvailable: z.ZodOptional<z.ZodBoolean>;
    }, "strict", z.ZodTypeAny, {
        value: string;
        type: string;
        variantId: string;
        stock: number;
        sku?: string | undefined;
        price?: number | undefined;
        attributes?: Record<string, string> | undefined;
        compareAtPrice?: number | undefined;
        images?: string[] | undefined;
        barcode?: string | undefined;
        weight?: number | undefined;
        isAvailable?: boolean | undefined;
    }, {
        value: string;
        type: string;
        variantId: string;
        stock: number;
        sku?: string | undefined;
        price?: number | undefined;
        attributes?: Record<string, string> | undefined;
        compareAtPrice?: number | undefined;
        images?: string[] | undefined;
        barcode?: string | undefined;
        weight?: number | undefined;
        isAvailable?: boolean | undefined;
    }>, "many">>;
    unlimited: z.ZodBoolean;
    estimatedRestockDate: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
    allowBackorder: z.ZodOptional<z.ZodBoolean>;
    reservedStock: z.ZodOptional<z.ZodNumber>;
}, "strict", z.ZodTypeAny, {
    stock: number;
    isAvailable: boolean;
    unlimited: boolean;
    lowStockThreshold?: number | undefined;
    variants?: {
        value: string;
        type: string;
        variantId: string;
        stock: number;
        sku?: string | undefined;
        price?: number | undefined;
        attributes?: Record<string, string> | undefined;
        compareAtPrice?: number | undefined;
        images?: string[] | undefined;
        barcode?: string | undefined;
        weight?: number | undefined;
        isAvailable?: boolean | undefined;
    }[] | undefined;
    estimatedRestockDate?: string | Date | undefined;
    allowBackorder?: boolean | undefined;
    reservedStock?: number | undefined;
}, {
    stock: number;
    isAvailable: boolean;
    unlimited: boolean;
    lowStockThreshold?: number | undefined;
    variants?: {
        value: string;
        type: string;
        variantId: string;
        stock: number;
        sku?: string | undefined;
        price?: number | undefined;
        attributes?: Record<string, string> | undefined;
        compareAtPrice?: number | undefined;
        images?: string[] | undefined;
        barcode?: string | undefined;
        weight?: number | undefined;
        isAvailable?: boolean | undefined;
    }[] | undefined;
    estimatedRestockDate?: string | Date | undefined;
    allowBackorder?: boolean | undefined;
    reservedStock?: number | undefined;
}>;
export declare const ProductModifierOptionSchema: z.ZodObject<{
    label: z.ZodString;
    price: z.ZodNumber;
    isDefault: z.ZodOptional<z.ZodBoolean>;
}, "strict", z.ZodTypeAny, {
    price: number;
    label: string;
    isDefault?: boolean | undefined;
}, {
    price: number;
    label: string;
    isDefault?: boolean | undefined;
}>;
export declare const ProductModifierSchema: z.ZodObject<{
    _id: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    required: z.ZodOptional<z.ZodBoolean>;
    multiSelect: z.ZodOptional<z.ZodBoolean>;
    options: z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        price: z.ZodNumber;
        isDefault: z.ZodOptional<z.ZodBoolean>;
    }, "strict", z.ZodTypeAny, {
        price: number;
        label: string;
        isDefault?: boolean | undefined;
    }, {
        price: number;
        label: string;
        isDefault?: boolean | undefined;
    }>, "many">;
}, "strict", z.ZodTypeAny, {
    name: string;
    options: {
        price: number;
        label: string;
        isDefault?: boolean | undefined;
    }[];
    _id?: string | undefined;
    required?: boolean | undefined;
    multiSelect?: boolean | undefined;
}, {
    name: string;
    options: {
        price: number;
        label: string;
        isDefault?: boolean | undefined;
    }[];
    _id?: string | undefined;
    required?: boolean | undefined;
    multiSelect?: boolean | undefined;
}>;
export declare const CreateProductSchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    shortDescription: z.ZodOptional<z.ZodString>;
    productType: z.ZodDefault<z.ZodEnum<["product", "service"]>>;
    category: z.ZodString;
    subCategory: z.ZodOptional<z.ZodString>;
    store: z.ZodString;
    merchantId: z.ZodOptional<z.ZodString>;
    brand: z.ZodOptional<z.ZodString>;
    sku: z.ZodString;
    barcode: z.ZodOptional<z.ZodString>;
    images: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    pricing: z.ZodEffects<z.ZodObject<{
        original: z.ZodNumber;
        selling: z.ZodNumber;
        discount: z.ZodOptional<z.ZodNumber>;
        currency: z.ZodDefault<z.ZodString>;
        bulk: z.ZodOptional<z.ZodArray<z.ZodObject<{
            minQuantity: z.ZodNumber;
            price: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            price: number;
            minQuantity: number;
        }, {
            price: number;
            minQuantity: number;
        }>, "many">>;
        gst: z.ZodOptional<z.ZodObject<{
            hsnCode: z.ZodOptional<z.ZodString>;
            sacCode: z.ZodOptional<z.ZodString>;
            gstRate: z.ZodOptional<z.ZodNumber>;
            taxSlab: z.ZodOptional<z.ZodEnum<["0", "5", "12", "18", "28", "exempt"]>>;
            isIGST: z.ZodOptional<z.ZodBoolean>;
        }, "strict", z.ZodTypeAny, {
            hsnCode?: string | undefined;
            sacCode?: string | undefined;
            gstRate?: number | undefined;
            taxSlab?: "0" | "5" | "12" | "18" | "28" | "exempt" | undefined;
            isIGST?: boolean | undefined;
        }, {
            hsnCode?: string | undefined;
            sacCode?: string | undefined;
            gstRate?: number | undefined;
            taxSlab?: "0" | "5" | "12" | "18" | "28" | "exempt" | undefined;
            isIGST?: boolean | undefined;
        }>>;
    }, "strict", z.ZodTypeAny, {
        selling: number;
        original: number;
        currency: string;
        discount?: number | undefined;
        bulk?: {
            price: number;
            minQuantity: number;
        }[] | undefined;
        gst?: {
            hsnCode?: string | undefined;
            sacCode?: string | undefined;
            gstRate?: number | undefined;
            taxSlab?: "0" | "5" | "12" | "18" | "28" | "exempt" | undefined;
            isIGST?: boolean | undefined;
        } | undefined;
    }, {
        selling: number;
        original: number;
        discount?: number | undefined;
        currency?: string | undefined;
        bulk?: {
            price: number;
            minQuantity: number;
        }[] | undefined;
        gst?: {
            hsnCode?: string | undefined;
            sacCode?: string | undefined;
            gstRate?: number | undefined;
            taxSlab?: "0" | "5" | "12" | "18" | "28" | "exempt" | undefined;
            isIGST?: boolean | undefined;
        } | undefined;
    }>, {
        selling: number;
        original: number;
        currency: string;
        discount?: number | undefined;
        bulk?: {
            price: number;
            minQuantity: number;
        }[] | undefined;
        gst?: {
            hsnCode?: string | undefined;
            sacCode?: string | undefined;
            gstRate?: number | undefined;
            taxSlab?: "0" | "5" | "12" | "18" | "28" | "exempt" | undefined;
            isIGST?: boolean | undefined;
        } | undefined;
    }, {
        selling: number;
        original: number;
        discount?: number | undefined;
        currency?: string | undefined;
        bulk?: {
            price: number;
            minQuantity: number;
        }[] | undefined;
        gst?: {
            hsnCode?: string | undefined;
            sacCode?: string | undefined;
            gstRate?: number | undefined;
            taxSlab?: "0" | "5" | "12" | "18" | "28" | "exempt" | undefined;
            isIGST?: boolean | undefined;
        } | undefined;
    }>;
    inventory: z.ZodObject<{
        stock: z.ZodNumber;
        isAvailable: z.ZodBoolean;
        lowStockThreshold: z.ZodOptional<z.ZodNumber>;
        variants: z.ZodOptional<z.ZodArray<z.ZodObject<{
            variantId: z.ZodString;
            type: z.ZodString;
            value: z.ZodString;
            attributes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            price: z.ZodOptional<z.ZodNumber>;
            compareAtPrice: z.ZodOptional<z.ZodNumber>;
            stock: z.ZodNumber;
            sku: z.ZodOptional<z.ZodString>;
            images: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            barcode: z.ZodOptional<z.ZodString>;
            weight: z.ZodOptional<z.ZodNumber>;
            isAvailable: z.ZodOptional<z.ZodBoolean>;
        }, "strict", z.ZodTypeAny, {
            value: string;
            type: string;
            variantId: string;
            stock: number;
            sku?: string | undefined;
            price?: number | undefined;
            attributes?: Record<string, string> | undefined;
            compareAtPrice?: number | undefined;
            images?: string[] | undefined;
            barcode?: string | undefined;
            weight?: number | undefined;
            isAvailable?: boolean | undefined;
        }, {
            value: string;
            type: string;
            variantId: string;
            stock: number;
            sku?: string | undefined;
            price?: number | undefined;
            attributes?: Record<string, string> | undefined;
            compareAtPrice?: number | undefined;
            images?: string[] | undefined;
            barcode?: string | undefined;
            weight?: number | undefined;
            isAvailable?: boolean | undefined;
        }>, "many">>;
        unlimited: z.ZodBoolean;
        estimatedRestockDate: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
        allowBackorder: z.ZodOptional<z.ZodBoolean>;
        reservedStock: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        stock: number;
        isAvailable: boolean;
        unlimited: boolean;
        lowStockThreshold?: number | undefined;
        variants?: {
            value: string;
            type: string;
            variantId: string;
            stock: number;
            sku?: string | undefined;
            price?: number | undefined;
            attributes?: Record<string, string> | undefined;
            compareAtPrice?: number | undefined;
            images?: string[] | undefined;
            barcode?: string | undefined;
            weight?: number | undefined;
            isAvailable?: boolean | undefined;
        }[] | undefined;
        estimatedRestockDate?: string | Date | undefined;
        allowBackorder?: boolean | undefined;
        reservedStock?: number | undefined;
    }, {
        stock: number;
        isAvailable: boolean;
        unlimited: boolean;
        lowStockThreshold?: number | undefined;
        variants?: {
            value: string;
            type: string;
            variantId: string;
            stock: number;
            sku?: string | undefined;
            price?: number | undefined;
            attributes?: Record<string, string> | undefined;
            compareAtPrice?: number | undefined;
            images?: string[] | undefined;
            barcode?: string | undefined;
            weight?: number | undefined;
            isAvailable?: boolean | undefined;
        }[] | undefined;
        estimatedRestockDate?: string | Date | undefined;
        allowBackorder?: boolean | undefined;
        reservedStock?: number | undefined;
    }>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    modifiers: z.ZodOptional<z.ZodArray<z.ZodObject<{
        _id: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        required: z.ZodOptional<z.ZodBoolean>;
        multiSelect: z.ZodOptional<z.ZodBoolean>;
        options: z.ZodArray<z.ZodObject<{
            label: z.ZodString;
            price: z.ZodNumber;
            isDefault: z.ZodOptional<z.ZodBoolean>;
        }, "strict", z.ZodTypeAny, {
            price: number;
            label: string;
            isDefault?: boolean | undefined;
        }, {
            price: number;
            label: string;
            isDefault?: boolean | undefined;
        }>, "many">;
    }, "strict", z.ZodTypeAny, {
        name: string;
        options: {
            price: number;
            label: string;
            isDefault?: boolean | undefined;
        }[];
        _id?: string | undefined;
        required?: boolean | undefined;
        multiSelect?: boolean | undefined;
    }, {
        name: string;
        options: {
            price: number;
            label: string;
            isDefault?: boolean | undefined;
        }[];
        _id?: string | undefined;
        required?: boolean | undefined;
        multiSelect?: boolean | undefined;
    }>, "many">>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    isFeatured: z.ZodDefault<z.ZodBoolean>;
    isDigital: z.ZodDefault<z.ZodBoolean>;
    visibility: z.ZodOptional<z.ZodEnum<["public", "hidden", "featured"]>>;
}, "strict", z.ZodTypeAny, {
    store: string;
    name: string;
    sku: string;
    pricing: {
        selling: number;
        original: number;
        currency: string;
        discount?: number | undefined;
        bulk?: {
            price: number;
            minQuantity: number;
        }[] | undefined;
        gst?: {
            hsnCode?: string | undefined;
            sacCode?: string | undefined;
            gstRate?: number | undefined;
            taxSlab?: "0" | "5" | "12" | "18" | "28" | "exempt" | undefined;
            isIGST?: boolean | undefined;
        } | undefined;
    };
    images: string[];
    productType: "product" | "service";
    category: string;
    inventory: {
        stock: number;
        isAvailable: boolean;
        unlimited: boolean;
        lowStockThreshold?: number | undefined;
        variants?: {
            value: string;
            type: string;
            variantId: string;
            stock: number;
            sku?: string | undefined;
            price?: number | undefined;
            attributes?: Record<string, string> | undefined;
            compareAtPrice?: number | undefined;
            images?: string[] | undefined;
            barcode?: string | undefined;
            weight?: number | undefined;
            isAvailable?: boolean | undefined;
        }[] | undefined;
        estimatedRestockDate?: string | Date | undefined;
        allowBackorder?: boolean | undefined;
        reservedStock?: number | undefined;
    };
    tags: string[];
    isActive: boolean;
    isFeatured: boolean;
    isDigital: boolean;
    barcode?: string | undefined;
    slug?: string | undefined;
    description?: string | undefined;
    shortDescription?: string | undefined;
    subCategory?: string | undefined;
    merchantId?: string | undefined;
    brand?: string | undefined;
    modifiers?: {
        name: string;
        options: {
            price: number;
            label: string;
            isDefault?: boolean | undefined;
        }[];
        _id?: string | undefined;
        required?: boolean | undefined;
        multiSelect?: boolean | undefined;
    }[] | undefined;
    visibility?: "public" | "hidden" | "featured" | undefined;
}, {
    store: string;
    name: string;
    sku: string;
    pricing: {
        selling: number;
        original: number;
        discount?: number | undefined;
        currency?: string | undefined;
        bulk?: {
            price: number;
            minQuantity: number;
        }[] | undefined;
        gst?: {
            hsnCode?: string | undefined;
            sacCode?: string | undefined;
            gstRate?: number | undefined;
            taxSlab?: "0" | "5" | "12" | "18" | "28" | "exempt" | undefined;
            isIGST?: boolean | undefined;
        } | undefined;
    };
    category: string;
    inventory: {
        stock: number;
        isAvailable: boolean;
        unlimited: boolean;
        lowStockThreshold?: number | undefined;
        variants?: {
            value: string;
            type: string;
            variantId: string;
            stock: number;
            sku?: string | undefined;
            price?: number | undefined;
            attributes?: Record<string, string> | undefined;
            compareAtPrice?: number | undefined;
            images?: string[] | undefined;
            barcode?: string | undefined;
            weight?: number | undefined;
            isAvailable?: boolean | undefined;
        }[] | undefined;
        estimatedRestockDate?: string | Date | undefined;
        allowBackorder?: boolean | undefined;
        reservedStock?: number | undefined;
    };
    images?: string[] | undefined;
    barcode?: string | undefined;
    slug?: string | undefined;
    description?: string | undefined;
    shortDescription?: string | undefined;
    productType?: "product" | "service" | undefined;
    subCategory?: string | undefined;
    merchantId?: string | undefined;
    brand?: string | undefined;
    tags?: string[] | undefined;
    modifiers?: {
        name: string;
        options: {
            price: number;
            label: string;
            isDefault?: boolean | undefined;
        }[];
        _id?: string | undefined;
        required?: boolean | undefined;
        multiSelect?: boolean | undefined;
    }[] | undefined;
    isActive?: boolean | undefined;
    isFeatured?: boolean | undefined;
    isDigital?: boolean | undefined;
    visibility?: "public" | "hidden" | "featured" | undefined;
}>;
export declare const UpdateProductSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    shortDescription: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    productType: z.ZodOptional<z.ZodDefault<z.ZodEnum<["product", "service"]>>>;
    category: z.ZodOptional<z.ZodString>;
    subCategory: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    store: z.ZodOptional<z.ZodString>;
    merchantId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    brand: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    sku: z.ZodOptional<z.ZodString>;
    barcode: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    images: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
    pricing: z.ZodOptional<z.ZodEffects<z.ZodObject<{
        original: z.ZodNumber;
        selling: z.ZodNumber;
        discount: z.ZodOptional<z.ZodNumber>;
        currency: z.ZodDefault<z.ZodString>;
        bulk: z.ZodOptional<z.ZodArray<z.ZodObject<{
            minQuantity: z.ZodNumber;
            price: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            price: number;
            minQuantity: number;
        }, {
            price: number;
            minQuantity: number;
        }>, "many">>;
        gst: z.ZodOptional<z.ZodObject<{
            hsnCode: z.ZodOptional<z.ZodString>;
            sacCode: z.ZodOptional<z.ZodString>;
            gstRate: z.ZodOptional<z.ZodNumber>;
            taxSlab: z.ZodOptional<z.ZodEnum<["0", "5", "12", "18", "28", "exempt"]>>;
            isIGST: z.ZodOptional<z.ZodBoolean>;
        }, "strict", z.ZodTypeAny, {
            hsnCode?: string | undefined;
            sacCode?: string | undefined;
            gstRate?: number | undefined;
            taxSlab?: "0" | "5" | "12" | "18" | "28" | "exempt" | undefined;
            isIGST?: boolean | undefined;
        }, {
            hsnCode?: string | undefined;
            sacCode?: string | undefined;
            gstRate?: number | undefined;
            taxSlab?: "0" | "5" | "12" | "18" | "28" | "exempt" | undefined;
            isIGST?: boolean | undefined;
        }>>;
    }, "strict", z.ZodTypeAny, {
        selling: number;
        original: number;
        currency: string;
        discount?: number | undefined;
        bulk?: {
            price: number;
            minQuantity: number;
        }[] | undefined;
        gst?: {
            hsnCode?: string | undefined;
            sacCode?: string | undefined;
            gstRate?: number | undefined;
            taxSlab?: "0" | "5" | "12" | "18" | "28" | "exempt" | undefined;
            isIGST?: boolean | undefined;
        } | undefined;
    }, {
        selling: number;
        original: number;
        discount?: number | undefined;
        currency?: string | undefined;
        bulk?: {
            price: number;
            minQuantity: number;
        }[] | undefined;
        gst?: {
            hsnCode?: string | undefined;
            sacCode?: string | undefined;
            gstRate?: number | undefined;
            taxSlab?: "0" | "5" | "12" | "18" | "28" | "exempt" | undefined;
            isIGST?: boolean | undefined;
        } | undefined;
    }>, {
        selling: number;
        original: number;
        currency: string;
        discount?: number | undefined;
        bulk?: {
            price: number;
            minQuantity: number;
        }[] | undefined;
        gst?: {
            hsnCode?: string | undefined;
            sacCode?: string | undefined;
            gstRate?: number | undefined;
            taxSlab?: "0" | "5" | "12" | "18" | "28" | "exempt" | undefined;
            isIGST?: boolean | undefined;
        } | undefined;
    }, {
        selling: number;
        original: number;
        discount?: number | undefined;
        currency?: string | undefined;
        bulk?: {
            price: number;
            minQuantity: number;
        }[] | undefined;
        gst?: {
            hsnCode?: string | undefined;
            sacCode?: string | undefined;
            gstRate?: number | undefined;
            taxSlab?: "0" | "5" | "12" | "18" | "28" | "exempt" | undefined;
            isIGST?: boolean | undefined;
        } | undefined;
    }>>;
    inventory: z.ZodOptional<z.ZodObject<{
        stock: z.ZodNumber;
        isAvailable: z.ZodBoolean;
        lowStockThreshold: z.ZodOptional<z.ZodNumber>;
        variants: z.ZodOptional<z.ZodArray<z.ZodObject<{
            variantId: z.ZodString;
            type: z.ZodString;
            value: z.ZodString;
            attributes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            price: z.ZodOptional<z.ZodNumber>;
            compareAtPrice: z.ZodOptional<z.ZodNumber>;
            stock: z.ZodNumber;
            sku: z.ZodOptional<z.ZodString>;
            images: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            barcode: z.ZodOptional<z.ZodString>;
            weight: z.ZodOptional<z.ZodNumber>;
            isAvailable: z.ZodOptional<z.ZodBoolean>;
        }, "strict", z.ZodTypeAny, {
            value: string;
            type: string;
            variantId: string;
            stock: number;
            sku?: string | undefined;
            price?: number | undefined;
            attributes?: Record<string, string> | undefined;
            compareAtPrice?: number | undefined;
            images?: string[] | undefined;
            barcode?: string | undefined;
            weight?: number | undefined;
            isAvailable?: boolean | undefined;
        }, {
            value: string;
            type: string;
            variantId: string;
            stock: number;
            sku?: string | undefined;
            price?: number | undefined;
            attributes?: Record<string, string> | undefined;
            compareAtPrice?: number | undefined;
            images?: string[] | undefined;
            barcode?: string | undefined;
            weight?: number | undefined;
            isAvailable?: boolean | undefined;
        }>, "many">>;
        unlimited: z.ZodBoolean;
        estimatedRestockDate: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
        allowBackorder: z.ZodOptional<z.ZodBoolean>;
        reservedStock: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        stock: number;
        isAvailable: boolean;
        unlimited: boolean;
        lowStockThreshold?: number | undefined;
        variants?: {
            value: string;
            type: string;
            variantId: string;
            stock: number;
            sku?: string | undefined;
            price?: number | undefined;
            attributes?: Record<string, string> | undefined;
            compareAtPrice?: number | undefined;
            images?: string[] | undefined;
            barcode?: string | undefined;
            weight?: number | undefined;
            isAvailable?: boolean | undefined;
        }[] | undefined;
        estimatedRestockDate?: string | Date | undefined;
        allowBackorder?: boolean | undefined;
        reservedStock?: number | undefined;
    }, {
        stock: number;
        isAvailable: boolean;
        unlimited: boolean;
        lowStockThreshold?: number | undefined;
        variants?: {
            value: string;
            type: string;
            variantId: string;
            stock: number;
            sku?: string | undefined;
            price?: number | undefined;
            attributes?: Record<string, string> | undefined;
            compareAtPrice?: number | undefined;
            images?: string[] | undefined;
            barcode?: string | undefined;
            weight?: number | undefined;
            isAvailable?: boolean | undefined;
        }[] | undefined;
        estimatedRestockDate?: string | Date | undefined;
        allowBackorder?: boolean | undefined;
        reservedStock?: number | undefined;
    }>>;
    tags: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
    modifiers: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodObject<{
        _id: z.ZodOptional<z.ZodString>;
        name: z.ZodString;
        required: z.ZodOptional<z.ZodBoolean>;
        multiSelect: z.ZodOptional<z.ZodBoolean>;
        options: z.ZodArray<z.ZodObject<{
            label: z.ZodString;
            price: z.ZodNumber;
            isDefault: z.ZodOptional<z.ZodBoolean>;
        }, "strict", z.ZodTypeAny, {
            price: number;
            label: string;
            isDefault?: boolean | undefined;
        }, {
            price: number;
            label: string;
            isDefault?: boolean | undefined;
        }>, "many">;
    }, "strict", z.ZodTypeAny, {
        name: string;
        options: {
            price: number;
            label: string;
            isDefault?: boolean | undefined;
        }[];
        _id?: string | undefined;
        required?: boolean | undefined;
        multiSelect?: boolean | undefined;
    }, {
        name: string;
        options: {
            price: number;
            label: string;
            isDefault?: boolean | undefined;
        }[];
        _id?: string | undefined;
        required?: boolean | undefined;
        multiSelect?: boolean | undefined;
    }>, "many">>>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    isFeatured: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    isDigital: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    visibility: z.ZodOptional<z.ZodOptional<z.ZodEnum<["public", "hidden", "featured"]>>>;
}, "strict", z.ZodTypeAny, {
    store?: string | undefined;
    name?: string | undefined;
    sku?: string | undefined;
    pricing?: {
        selling: number;
        original: number;
        currency: string;
        discount?: number | undefined;
        bulk?: {
            price: number;
            minQuantity: number;
        }[] | undefined;
        gst?: {
            hsnCode?: string | undefined;
            sacCode?: string | undefined;
            gstRate?: number | undefined;
            taxSlab?: "0" | "5" | "12" | "18" | "28" | "exempt" | undefined;
            isIGST?: boolean | undefined;
        } | undefined;
    } | undefined;
    images?: string[] | undefined;
    barcode?: string | undefined;
    slug?: string | undefined;
    description?: string | undefined;
    shortDescription?: string | undefined;
    productType?: "product" | "service" | undefined;
    category?: string | undefined;
    subCategory?: string | undefined;
    merchantId?: string | undefined;
    brand?: string | undefined;
    inventory?: {
        stock: number;
        isAvailable: boolean;
        unlimited: boolean;
        lowStockThreshold?: number | undefined;
        variants?: {
            value: string;
            type: string;
            variantId: string;
            stock: number;
            sku?: string | undefined;
            price?: number | undefined;
            attributes?: Record<string, string> | undefined;
            compareAtPrice?: number | undefined;
            images?: string[] | undefined;
            barcode?: string | undefined;
            weight?: number | undefined;
            isAvailable?: boolean | undefined;
        }[] | undefined;
        estimatedRestockDate?: string | Date | undefined;
        allowBackorder?: boolean | undefined;
        reservedStock?: number | undefined;
    } | undefined;
    tags?: string[] | undefined;
    modifiers?: {
        name: string;
        options: {
            price: number;
            label: string;
            isDefault?: boolean | undefined;
        }[];
        _id?: string | undefined;
        required?: boolean | undefined;
        multiSelect?: boolean | undefined;
    }[] | undefined;
    isActive?: boolean | undefined;
    isFeatured?: boolean | undefined;
    isDigital?: boolean | undefined;
    visibility?: "public" | "hidden" | "featured" | undefined;
}, {
    store?: string | undefined;
    name?: string | undefined;
    sku?: string | undefined;
    pricing?: {
        selling: number;
        original: number;
        discount?: number | undefined;
        currency?: string | undefined;
        bulk?: {
            price: number;
            minQuantity: number;
        }[] | undefined;
        gst?: {
            hsnCode?: string | undefined;
            sacCode?: string | undefined;
            gstRate?: number | undefined;
            taxSlab?: "0" | "5" | "12" | "18" | "28" | "exempt" | undefined;
            isIGST?: boolean | undefined;
        } | undefined;
    } | undefined;
    images?: string[] | undefined;
    barcode?: string | undefined;
    slug?: string | undefined;
    description?: string | undefined;
    shortDescription?: string | undefined;
    productType?: "product" | "service" | undefined;
    category?: string | undefined;
    subCategory?: string | undefined;
    merchantId?: string | undefined;
    brand?: string | undefined;
    inventory?: {
        stock: number;
        isAvailable: boolean;
        unlimited: boolean;
        lowStockThreshold?: number | undefined;
        variants?: {
            value: string;
            type: string;
            variantId: string;
            stock: number;
            sku?: string | undefined;
            price?: number | undefined;
            attributes?: Record<string, string> | undefined;
            compareAtPrice?: number | undefined;
            images?: string[] | undefined;
            barcode?: string | undefined;
            weight?: number | undefined;
            isAvailable?: boolean | undefined;
        }[] | undefined;
        estimatedRestockDate?: string | Date | undefined;
        allowBackorder?: boolean | undefined;
        reservedStock?: number | undefined;
    } | undefined;
    tags?: string[] | undefined;
    modifiers?: {
        name: string;
        options: {
            price: number;
            label: string;
            isDefault?: boolean | undefined;
        }[];
        _id?: string | undefined;
        required?: boolean | undefined;
        multiSelect?: boolean | undefined;
    }[] | undefined;
    isActive?: boolean | undefined;
    isFeatured?: boolean | undefined;
    isDigital?: boolean | undefined;
    visibility?: "public" | "hidden" | "featured" | undefined;
}>;
export declare const ProductResponseSchema: z.ZodObject<{
    _id: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    slug: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    productType: z.ZodEnum<["product", "service"]>;
    category: z.ZodString;
    store: z.ZodString;
    merchantId: z.ZodOptional<z.ZodString>;
    sku: z.ZodString;
    images: z.ZodArray<z.ZodString, "many">;
    pricing: z.ZodEffects<z.ZodObject<{
        original: z.ZodNumber;
        selling: z.ZodNumber;
        discount: z.ZodOptional<z.ZodNumber>;
        currency: z.ZodDefault<z.ZodString>;
        bulk: z.ZodOptional<z.ZodArray<z.ZodObject<{
            minQuantity: z.ZodNumber;
            price: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            price: number;
            minQuantity: number;
        }, {
            price: number;
            minQuantity: number;
        }>, "many">>;
        gst: z.ZodOptional<z.ZodObject<{
            hsnCode: z.ZodOptional<z.ZodString>;
            sacCode: z.ZodOptional<z.ZodString>;
            gstRate: z.ZodOptional<z.ZodNumber>;
            taxSlab: z.ZodOptional<z.ZodEnum<["0", "5", "12", "18", "28", "exempt"]>>;
            isIGST: z.ZodOptional<z.ZodBoolean>;
        }, "strict", z.ZodTypeAny, {
            hsnCode?: string | undefined;
            sacCode?: string | undefined;
            gstRate?: number | undefined;
            taxSlab?: "0" | "5" | "12" | "18" | "28" | "exempt" | undefined;
            isIGST?: boolean | undefined;
        }, {
            hsnCode?: string | undefined;
            sacCode?: string | undefined;
            gstRate?: number | undefined;
            taxSlab?: "0" | "5" | "12" | "18" | "28" | "exempt" | undefined;
            isIGST?: boolean | undefined;
        }>>;
    }, "strict", z.ZodTypeAny, {
        selling: number;
        original: number;
        currency: string;
        discount?: number | undefined;
        bulk?: {
            price: number;
            minQuantity: number;
        }[] | undefined;
        gst?: {
            hsnCode?: string | undefined;
            sacCode?: string | undefined;
            gstRate?: number | undefined;
            taxSlab?: "0" | "5" | "12" | "18" | "28" | "exempt" | undefined;
            isIGST?: boolean | undefined;
        } | undefined;
    }, {
        selling: number;
        original: number;
        discount?: number | undefined;
        currency?: string | undefined;
        bulk?: {
            price: number;
            minQuantity: number;
        }[] | undefined;
        gst?: {
            hsnCode?: string | undefined;
            sacCode?: string | undefined;
            gstRate?: number | undefined;
            taxSlab?: "0" | "5" | "12" | "18" | "28" | "exempt" | undefined;
            isIGST?: boolean | undefined;
        } | undefined;
    }>, {
        selling: number;
        original: number;
        currency: string;
        discount?: number | undefined;
        bulk?: {
            price: number;
            minQuantity: number;
        }[] | undefined;
        gst?: {
            hsnCode?: string | undefined;
            sacCode?: string | undefined;
            gstRate?: number | undefined;
            taxSlab?: "0" | "5" | "12" | "18" | "28" | "exempt" | undefined;
            isIGST?: boolean | undefined;
        } | undefined;
    }, {
        selling: number;
        original: number;
        discount?: number | undefined;
        currency?: string | undefined;
        bulk?: {
            price: number;
            minQuantity: number;
        }[] | undefined;
        gst?: {
            hsnCode?: string | undefined;
            sacCode?: string | undefined;
            gstRate?: number | undefined;
            taxSlab?: "0" | "5" | "12" | "18" | "28" | "exempt" | undefined;
            isIGST?: boolean | undefined;
        } | undefined;
    }>;
    inventory: z.ZodObject<{
        stock: z.ZodNumber;
        isAvailable: z.ZodBoolean;
        lowStockThreshold: z.ZodOptional<z.ZodNumber>;
        variants: z.ZodOptional<z.ZodArray<z.ZodObject<{
            variantId: z.ZodString;
            type: z.ZodString;
            value: z.ZodString;
            attributes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            price: z.ZodOptional<z.ZodNumber>;
            compareAtPrice: z.ZodOptional<z.ZodNumber>;
            stock: z.ZodNumber;
            sku: z.ZodOptional<z.ZodString>;
            images: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            barcode: z.ZodOptional<z.ZodString>;
            weight: z.ZodOptional<z.ZodNumber>;
            isAvailable: z.ZodOptional<z.ZodBoolean>;
        }, "strict", z.ZodTypeAny, {
            value: string;
            type: string;
            variantId: string;
            stock: number;
            sku?: string | undefined;
            price?: number | undefined;
            attributes?: Record<string, string> | undefined;
            compareAtPrice?: number | undefined;
            images?: string[] | undefined;
            barcode?: string | undefined;
            weight?: number | undefined;
            isAvailable?: boolean | undefined;
        }, {
            value: string;
            type: string;
            variantId: string;
            stock: number;
            sku?: string | undefined;
            price?: number | undefined;
            attributes?: Record<string, string> | undefined;
            compareAtPrice?: number | undefined;
            images?: string[] | undefined;
            barcode?: string | undefined;
            weight?: number | undefined;
            isAvailable?: boolean | undefined;
        }>, "many">>;
        unlimited: z.ZodBoolean;
        estimatedRestockDate: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
        allowBackorder: z.ZodOptional<z.ZodBoolean>;
        reservedStock: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        stock: number;
        isAvailable: boolean;
        unlimited: boolean;
        lowStockThreshold?: number | undefined;
        variants?: {
            value: string;
            type: string;
            variantId: string;
            stock: number;
            sku?: string | undefined;
            price?: number | undefined;
            attributes?: Record<string, string> | undefined;
            compareAtPrice?: number | undefined;
            images?: string[] | undefined;
            barcode?: string | undefined;
            weight?: number | undefined;
            isAvailable?: boolean | undefined;
        }[] | undefined;
        estimatedRestockDate?: string | Date | undefined;
        allowBackorder?: boolean | undefined;
        reservedStock?: number | undefined;
    }, {
        stock: number;
        isAvailable: boolean;
        unlimited: boolean;
        lowStockThreshold?: number | undefined;
        variants?: {
            value: string;
            type: string;
            variantId: string;
            stock: number;
            sku?: string | undefined;
            price?: number | undefined;
            attributes?: Record<string, string> | undefined;
            compareAtPrice?: number | undefined;
            images?: string[] | undefined;
            barcode?: string | undefined;
            weight?: number | undefined;
            isAvailable?: boolean | undefined;
        }[] | undefined;
        estimatedRestockDate?: string | Date | undefined;
        allowBackorder?: boolean | undefined;
        reservedStock?: number | undefined;
    }>;
    ratings: z.ZodObject<{
        average: z.ZodNumber;
        count: z.ZodNumber;
        distribution: z.ZodObject<{
            5: z.ZodNumber;
            4: z.ZodNumber;
            3: z.ZodNumber;
            2: z.ZodNumber;
            1: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            2: number;
            3: number;
            1: number;
            4: number;
            5: number;
        }, {
            2: number;
            3: number;
            1: number;
            4: number;
            5: number;
        }>;
    }, "strict", z.ZodTypeAny, {
        average: number;
        count: number;
        distribution: {
            2: number;
            3: number;
            1: number;
            4: number;
            5: number;
        };
    }, {
        average: number;
        count: number;
        distribution: {
            2: number;
            3: number;
            1: number;
            4: number;
            5: number;
        };
    }>;
    tags: z.ZodArray<z.ZodString, "many">;
    isActive: z.ZodBoolean;
    isFeatured: z.ZodBoolean;
    isDigital: z.ZodBoolean;
    visibility: z.ZodOptional<z.ZodEnum<["public", "hidden", "featured"]>>;
    createdAt: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    updatedAt: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    isDeleted: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    store: string;
    name: string;
    sku: string;
    pricing: {
        selling: number;
        original: number;
        currency: string;
        discount?: number | undefined;
        bulk?: {
            price: number;
            minQuantity: number;
        }[] | undefined;
        gst?: {
            hsnCode?: string | undefined;
            sacCode?: string | undefined;
            gstRate?: number | undefined;
            taxSlab?: "0" | "5" | "12" | "18" | "28" | "exempt" | undefined;
            isIGST?: boolean | undefined;
        } | undefined;
    };
    createdAt: string | Date;
    updatedAt: string | Date;
    images: string[];
    slug: string;
    productType: "product" | "service";
    category: string;
    inventory: {
        stock: number;
        isAvailable: boolean;
        unlimited: boolean;
        lowStockThreshold?: number | undefined;
        variants?: {
            value: string;
            type: string;
            variantId: string;
            stock: number;
            sku?: string | undefined;
            price?: number | undefined;
            attributes?: Record<string, string> | undefined;
            compareAtPrice?: number | undefined;
            images?: string[] | undefined;
            barcode?: string | undefined;
            weight?: number | undefined;
            isAvailable?: boolean | undefined;
        }[] | undefined;
        estimatedRestockDate?: string | Date | undefined;
        allowBackorder?: boolean | undefined;
        reservedStock?: number | undefined;
    };
    tags: string[];
    isActive: boolean;
    isFeatured: boolean;
    isDigital: boolean;
    ratings: {
        average: number;
        count: number;
        distribution: {
            2: number;
            3: number;
            1: number;
            4: number;
            5: number;
        };
    };
    isDeleted: boolean;
    _id?: string | undefined;
    description?: string | undefined;
    merchantId?: string | undefined;
    visibility?: "public" | "hidden" | "featured" | undefined;
}, {
    store: string;
    name: string;
    sku: string;
    pricing: {
        selling: number;
        original: number;
        discount?: number | undefined;
        currency?: string | undefined;
        bulk?: {
            price: number;
            minQuantity: number;
        }[] | undefined;
        gst?: {
            hsnCode?: string | undefined;
            sacCode?: string | undefined;
            gstRate?: number | undefined;
            taxSlab?: "0" | "5" | "12" | "18" | "28" | "exempt" | undefined;
            isIGST?: boolean | undefined;
        } | undefined;
    };
    createdAt: string | Date;
    updatedAt: string | Date;
    images: string[];
    slug: string;
    productType: "product" | "service";
    category: string;
    inventory: {
        stock: number;
        isAvailable: boolean;
        unlimited: boolean;
        lowStockThreshold?: number | undefined;
        variants?: {
            value: string;
            type: string;
            variantId: string;
            stock: number;
            sku?: string | undefined;
            price?: number | undefined;
            attributes?: Record<string, string> | undefined;
            compareAtPrice?: number | undefined;
            images?: string[] | undefined;
            barcode?: string | undefined;
            weight?: number | undefined;
            isAvailable?: boolean | undefined;
        }[] | undefined;
        estimatedRestockDate?: string | Date | undefined;
        allowBackorder?: boolean | undefined;
        reservedStock?: number | undefined;
    };
    tags: string[];
    isActive: boolean;
    isFeatured: boolean;
    isDigital: boolean;
    ratings: {
        average: number;
        count: number;
        distribution: {
            2: number;
            3: number;
            1: number;
            4: number;
            5: number;
        };
    };
    isDeleted: boolean;
    _id?: string | undefined;
    description?: string | undefined;
    merchantId?: string | undefined;
    visibility?: "public" | "hidden" | "featured" | undefined;
}>;
export declare const ProductListResponseSchema: z.ZodArray<z.ZodObject<{
    _id: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    slug: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    productType: z.ZodEnum<["product", "service"]>;
    category: z.ZodString;
    store: z.ZodString;
    merchantId: z.ZodOptional<z.ZodString>;
    sku: z.ZodString;
    images: z.ZodArray<z.ZodString, "many">;
    pricing: z.ZodEffects<z.ZodObject<{
        original: z.ZodNumber;
        selling: z.ZodNumber;
        discount: z.ZodOptional<z.ZodNumber>;
        currency: z.ZodDefault<z.ZodString>;
        bulk: z.ZodOptional<z.ZodArray<z.ZodObject<{
            minQuantity: z.ZodNumber;
            price: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            price: number;
            minQuantity: number;
        }, {
            price: number;
            minQuantity: number;
        }>, "many">>;
        gst: z.ZodOptional<z.ZodObject<{
            hsnCode: z.ZodOptional<z.ZodString>;
            sacCode: z.ZodOptional<z.ZodString>;
            gstRate: z.ZodOptional<z.ZodNumber>;
            taxSlab: z.ZodOptional<z.ZodEnum<["0", "5", "12", "18", "28", "exempt"]>>;
            isIGST: z.ZodOptional<z.ZodBoolean>;
        }, "strict", z.ZodTypeAny, {
            hsnCode?: string | undefined;
            sacCode?: string | undefined;
            gstRate?: number | undefined;
            taxSlab?: "0" | "5" | "12" | "18" | "28" | "exempt" | undefined;
            isIGST?: boolean | undefined;
        }, {
            hsnCode?: string | undefined;
            sacCode?: string | undefined;
            gstRate?: number | undefined;
            taxSlab?: "0" | "5" | "12" | "18" | "28" | "exempt" | undefined;
            isIGST?: boolean | undefined;
        }>>;
    }, "strict", z.ZodTypeAny, {
        selling: number;
        original: number;
        currency: string;
        discount?: number | undefined;
        bulk?: {
            price: number;
            minQuantity: number;
        }[] | undefined;
        gst?: {
            hsnCode?: string | undefined;
            sacCode?: string | undefined;
            gstRate?: number | undefined;
            taxSlab?: "0" | "5" | "12" | "18" | "28" | "exempt" | undefined;
            isIGST?: boolean | undefined;
        } | undefined;
    }, {
        selling: number;
        original: number;
        discount?: number | undefined;
        currency?: string | undefined;
        bulk?: {
            price: number;
            minQuantity: number;
        }[] | undefined;
        gst?: {
            hsnCode?: string | undefined;
            sacCode?: string | undefined;
            gstRate?: number | undefined;
            taxSlab?: "0" | "5" | "12" | "18" | "28" | "exempt" | undefined;
            isIGST?: boolean | undefined;
        } | undefined;
    }>, {
        selling: number;
        original: number;
        currency: string;
        discount?: number | undefined;
        bulk?: {
            price: number;
            minQuantity: number;
        }[] | undefined;
        gst?: {
            hsnCode?: string | undefined;
            sacCode?: string | undefined;
            gstRate?: number | undefined;
            taxSlab?: "0" | "5" | "12" | "18" | "28" | "exempt" | undefined;
            isIGST?: boolean | undefined;
        } | undefined;
    }, {
        selling: number;
        original: number;
        discount?: number | undefined;
        currency?: string | undefined;
        bulk?: {
            price: number;
            minQuantity: number;
        }[] | undefined;
        gst?: {
            hsnCode?: string | undefined;
            sacCode?: string | undefined;
            gstRate?: number | undefined;
            taxSlab?: "0" | "5" | "12" | "18" | "28" | "exempt" | undefined;
            isIGST?: boolean | undefined;
        } | undefined;
    }>;
    inventory: z.ZodObject<{
        stock: z.ZodNumber;
        isAvailable: z.ZodBoolean;
        lowStockThreshold: z.ZodOptional<z.ZodNumber>;
        variants: z.ZodOptional<z.ZodArray<z.ZodObject<{
            variantId: z.ZodString;
            type: z.ZodString;
            value: z.ZodString;
            attributes: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
            price: z.ZodOptional<z.ZodNumber>;
            compareAtPrice: z.ZodOptional<z.ZodNumber>;
            stock: z.ZodNumber;
            sku: z.ZodOptional<z.ZodString>;
            images: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            barcode: z.ZodOptional<z.ZodString>;
            weight: z.ZodOptional<z.ZodNumber>;
            isAvailable: z.ZodOptional<z.ZodBoolean>;
        }, "strict", z.ZodTypeAny, {
            value: string;
            type: string;
            variantId: string;
            stock: number;
            sku?: string | undefined;
            price?: number | undefined;
            attributes?: Record<string, string> | undefined;
            compareAtPrice?: number | undefined;
            images?: string[] | undefined;
            barcode?: string | undefined;
            weight?: number | undefined;
            isAvailable?: boolean | undefined;
        }, {
            value: string;
            type: string;
            variantId: string;
            stock: number;
            sku?: string | undefined;
            price?: number | undefined;
            attributes?: Record<string, string> | undefined;
            compareAtPrice?: number | undefined;
            images?: string[] | undefined;
            barcode?: string | undefined;
            weight?: number | undefined;
            isAvailable?: boolean | undefined;
        }>, "many">>;
        unlimited: z.ZodBoolean;
        estimatedRestockDate: z.ZodOptional<z.ZodUnion<[z.ZodDate, z.ZodString]>>;
        allowBackorder: z.ZodOptional<z.ZodBoolean>;
        reservedStock: z.ZodOptional<z.ZodNumber>;
    }, "strict", z.ZodTypeAny, {
        stock: number;
        isAvailable: boolean;
        unlimited: boolean;
        lowStockThreshold?: number | undefined;
        variants?: {
            value: string;
            type: string;
            variantId: string;
            stock: number;
            sku?: string | undefined;
            price?: number | undefined;
            attributes?: Record<string, string> | undefined;
            compareAtPrice?: number | undefined;
            images?: string[] | undefined;
            barcode?: string | undefined;
            weight?: number | undefined;
            isAvailable?: boolean | undefined;
        }[] | undefined;
        estimatedRestockDate?: string | Date | undefined;
        allowBackorder?: boolean | undefined;
        reservedStock?: number | undefined;
    }, {
        stock: number;
        isAvailable: boolean;
        unlimited: boolean;
        lowStockThreshold?: number | undefined;
        variants?: {
            value: string;
            type: string;
            variantId: string;
            stock: number;
            sku?: string | undefined;
            price?: number | undefined;
            attributes?: Record<string, string> | undefined;
            compareAtPrice?: number | undefined;
            images?: string[] | undefined;
            barcode?: string | undefined;
            weight?: number | undefined;
            isAvailable?: boolean | undefined;
        }[] | undefined;
        estimatedRestockDate?: string | Date | undefined;
        allowBackorder?: boolean | undefined;
        reservedStock?: number | undefined;
    }>;
    ratings: z.ZodObject<{
        average: z.ZodNumber;
        count: z.ZodNumber;
        distribution: z.ZodObject<{
            5: z.ZodNumber;
            4: z.ZodNumber;
            3: z.ZodNumber;
            2: z.ZodNumber;
            1: z.ZodNumber;
        }, "strict", z.ZodTypeAny, {
            2: number;
            3: number;
            1: number;
            4: number;
            5: number;
        }, {
            2: number;
            3: number;
            1: number;
            4: number;
            5: number;
        }>;
    }, "strict", z.ZodTypeAny, {
        average: number;
        count: number;
        distribution: {
            2: number;
            3: number;
            1: number;
            4: number;
            5: number;
        };
    }, {
        average: number;
        count: number;
        distribution: {
            2: number;
            3: number;
            1: number;
            4: number;
            5: number;
        };
    }>;
    tags: z.ZodArray<z.ZodString, "many">;
    isActive: z.ZodBoolean;
    isFeatured: z.ZodBoolean;
    isDigital: z.ZodBoolean;
    visibility: z.ZodOptional<z.ZodEnum<["public", "hidden", "featured"]>>;
    createdAt: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    updatedAt: z.ZodUnion<[z.ZodDate, z.ZodString]>;
    isDeleted: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    store: string;
    name: string;
    sku: string;
    pricing: {
        selling: number;
        original: number;
        currency: string;
        discount?: number | undefined;
        bulk?: {
            price: number;
            minQuantity: number;
        }[] | undefined;
        gst?: {
            hsnCode?: string | undefined;
            sacCode?: string | undefined;
            gstRate?: number | undefined;
            taxSlab?: "0" | "5" | "12" | "18" | "28" | "exempt" | undefined;
            isIGST?: boolean | undefined;
        } | undefined;
    };
    createdAt: string | Date;
    updatedAt: string | Date;
    images: string[];
    slug: string;
    productType: "product" | "service";
    category: string;
    inventory: {
        stock: number;
        isAvailable: boolean;
        unlimited: boolean;
        lowStockThreshold?: number | undefined;
        variants?: {
            value: string;
            type: string;
            variantId: string;
            stock: number;
            sku?: string | undefined;
            price?: number | undefined;
            attributes?: Record<string, string> | undefined;
            compareAtPrice?: number | undefined;
            images?: string[] | undefined;
            barcode?: string | undefined;
            weight?: number | undefined;
            isAvailable?: boolean | undefined;
        }[] | undefined;
        estimatedRestockDate?: string | Date | undefined;
        allowBackorder?: boolean | undefined;
        reservedStock?: number | undefined;
    };
    tags: string[];
    isActive: boolean;
    isFeatured: boolean;
    isDigital: boolean;
    ratings: {
        average: number;
        count: number;
        distribution: {
            2: number;
            3: number;
            1: number;
            4: number;
            5: number;
        };
    };
    isDeleted: boolean;
    _id?: string | undefined;
    description?: string | undefined;
    merchantId?: string | undefined;
    visibility?: "public" | "hidden" | "featured" | undefined;
}, {
    store: string;
    name: string;
    sku: string;
    pricing: {
        selling: number;
        original: number;
        discount?: number | undefined;
        currency?: string | undefined;
        bulk?: {
            price: number;
            minQuantity: number;
        }[] | undefined;
        gst?: {
            hsnCode?: string | undefined;
            sacCode?: string | undefined;
            gstRate?: number | undefined;
            taxSlab?: "0" | "5" | "12" | "18" | "28" | "exempt" | undefined;
            isIGST?: boolean | undefined;
        } | undefined;
    };
    createdAt: string | Date;
    updatedAt: string | Date;
    images: string[];
    slug: string;
    productType: "product" | "service";
    category: string;
    inventory: {
        stock: number;
        isAvailable: boolean;
        unlimited: boolean;
        lowStockThreshold?: number | undefined;
        variants?: {
            value: string;
            type: string;
            variantId: string;
            stock: number;
            sku?: string | undefined;
            price?: number | undefined;
            attributes?: Record<string, string> | undefined;
            compareAtPrice?: number | undefined;
            images?: string[] | undefined;
            barcode?: string | undefined;
            weight?: number | undefined;
            isAvailable?: boolean | undefined;
        }[] | undefined;
        estimatedRestockDate?: string | Date | undefined;
        allowBackorder?: boolean | undefined;
        reservedStock?: number | undefined;
    };
    tags: string[];
    isActive: boolean;
    isFeatured: boolean;
    isDigital: boolean;
    ratings: {
        average: number;
        count: number;
        distribution: {
            2: number;
            3: number;
            1: number;
            4: number;
            5: number;
        };
    };
    isDeleted: boolean;
    _id?: string | undefined;
    description?: string | undefined;
    merchantId?: string | undefined;
    visibility?: "public" | "hidden" | "featured" | undefined;
}>, "many">;
export type CreateProductRequest = z.infer<typeof CreateProductSchema>;
export type UpdateProductRequest = z.infer<typeof UpdateProductSchema>;
export type ProductResponse = z.infer<typeof ProductResponseSchema>;
export type ProductListResponse = z.infer<typeof ProductListResponseSchema>;
//# sourceMappingURL=product.schema.d.ts.map