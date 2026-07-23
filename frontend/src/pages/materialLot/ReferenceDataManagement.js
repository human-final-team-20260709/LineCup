import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { referenceApi } from "../../api/services";
import { queryKeys } from "../../api/config";
import { extractApiError } from "../../api/client";
import useDebouncedValue from "../../hooks/useDebouncedValue";
import CommonPagination from "../../components/CommonPagination";
import { QueryStatus } from "../../components/ApiState";
import {
  Badge,
  Button,
  Card,
  FormGrid,
  Input,
  Select,
  Table,
  TableWrap,
  Toolbar,
  pageContent,
  toneForStatus,
} from "../../components/OperationalUi";

const PAGE_SIZE = 10;
const emptyProduct = {
  productId: null,
  productCode: "",
  productName: "",
  category: "",
  unit: "",
  status: "ACTIVE",
};
const emptyMaterial = {
  materialId: null,
  materialCode: "",
  materialName: "",
  unit: "",
  safetyStockQty: "0",
  status: "ACTIVE",
};

export default function ReferenceDataManagement({ canManage = false }) {
  const queryClient = useQueryClient();
  const [section, setSection] = useState("product");
  const [productKeywordDraft, setProductKeywordDraft] = useState("");
  const [materialKeywordDraft, setMaterialKeywordDraft] = useState("");
  const [productStatus, setProductStatus] = useState("");
  const [materialStatus, setMaterialStatus] = useState("");
  const [productPage, setProductPage] = useState(0);
  const [materialPage, setMaterialPage] = useState(0);
  const [productForm, setProductForm] = useState(null);
  const [materialForm, setMaterialForm] = useState(null);
  const [message, setMessage] = useState("");

  const productKeyword = useDebouncedValue(productKeywordDraft.trim());
  const materialKeyword = useDebouncedValue(materialKeywordDraft.trim());
  const productParams = {
    keyword: productKeyword || undefined,
    status: productStatus || undefined,
    page: productPage,
    size: PAGE_SIZE,
  };
  const materialParams = {
    keyword: materialKeyword || undefined,
    status: materialStatus || undefined,
    page: materialPage,
    size: PAGE_SIZE,
  };

  const productsQuery = useQuery({
    queryKey: queryKeys.products(productParams),
    queryFn: () => referenceApi.products(productParams),
    placeholderData: (previous) => previous,
  });
  const materialsQuery = useQuery({
    queryKey: queryKeys.materials(materialParams),
    queryFn: () => referenceApi.rawMaterials(materialParams),
    placeholderData: (previous) => previous,
  });

  const invalidateProducts = () => Promise.all([
    queryClient.invalidateQueries({ queryKey: ["products"] }),
    queryClient.invalidateQueries({ queryKey: ["materials"] }),
  ]);
  const invalidateMaterials = () => queryClient.invalidateQueries({ queryKey: ["materials"] });
  const productMutation = useMutation({
    mutationFn: ({ productId, payload }) => productId
      ? referenceApi.updateProduct(productId, payload)
      : referenceApi.createProduct(payload),
    onSuccess: invalidateProducts,
  });
  const materialMutation = useMutation({
    mutationFn: ({ materialId, payload }) => materialId
      ? referenceApi.updateRawMaterial(materialId, payload)
      : referenceApi.createRawMaterial(payload),
    onSuccess: invalidateMaterials,
  });

  const saveProduct = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      await productMutation.mutateAsync({
        productId: productForm.productId,
        payload: {
          productCode: productForm.productCode.trim(),
          productName: productForm.productName.trim(),
          category: productForm.category.trim(),
          unit: productForm.unit.trim(),
          status: productForm.status,
        },
      });
      setProductForm(null);
      setMessage("제품 기준정보를 저장했습니다.");
    } catch (error) {
      setMessage(extractApiError(error));
    }
  };

  const saveMaterial = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      await materialMutation.mutateAsync({
        materialId: materialForm.materialId,
        payload: {
          materialCode: materialForm.materialCode.trim(),
          materialName: materialForm.materialName.trim(),
          unit: materialForm.unit.trim(),
          safetyStockQty: Number(materialForm.safetyStockQty),
          status: materialForm.status,
        },
      });
      setMaterialForm(null);
      setMessage("원자재 기준정보를 저장했습니다.");
    } catch (error) {
      setMessage(extractApiError(error));
    }
  };

  const products = pageContent(productsQuery.data);
  const materials = pageContent(materialsQuery.data);

  return (
    <>
      <Toolbar aria-label="기준정보 유형">
        <Button
          type="button"
          $secondary={section !== "product"}
          onClick={() => {
            setSection("product");
            setMessage("");
          }}
        >
          제품
        </Button>
        <Button
          type="button"
          $secondary={section !== "material"}
          onClick={() => {
            setSection("material");
            setMessage("");
          }}
        >
          원자재
        </Button>
      </Toolbar>

      {message && <p role="status">{message}</p>}

      {section === "product" && (
        <>
          <Toolbar>
            <Input
              value={productKeywordDraft}
              onChange={(event) => {
                setProductKeywordDraft(event.target.value);
                setProductPage(0);
              }}
              placeholder="제품 코드·제품명 검색"
            />
            <Select
              value={productStatus}
              onChange={(event) => {
                setProductStatus(event.target.value);
                setProductPage(0);
              }}
            >
              <option value="">전체 상태</option>
              <option value="ACTIVE">사용 중</option>
              <option value="REVIEW">검토</option>
              <option value="INACTIVE">사용 중지</option>
            </Select>
            {canManage && (
              <Button type="button" onClick={() => setProductForm({ ...emptyProduct })}>
                제품 등록
              </Button>
            )}
          </Toolbar>

          {productForm && (
            <Card>
              <h2>{productForm.productId ? "제품 수정" : "제품 등록"}</h2>
              <FormGrid onSubmit={saveProduct}>
                <label>
                  제품 코드
                  <input
                    maxLength="30"
                    value={productForm.productCode}
                    onChange={(event) => setProductForm({ ...productForm, productCode: event.target.value })}
                    required
                  />
                </label>
                <label>
                  제품명
                  <input
                    maxLength="100"
                    value={productForm.productName}
                    onChange={(event) => setProductForm({ ...productForm, productName: event.target.value })}
                    required
                  />
                </label>
                <label>
                  제품 분류
                  <input
                    maxLength="50"
                    value={productForm.category}
                    onChange={(event) => setProductForm({ ...productForm, category: event.target.value })}
                    required
                  />
                </label>
                <label>
                  단위
                  <input
                    maxLength="10"
                    value={productForm.unit}
                    onChange={(event) => setProductForm({ ...productForm, unit: event.target.value })}
                    placeholder="예: EA"
                    required
                  />
                </label>
                <label>
                  상태
                  <Select
                    value={productForm.status}
                    onChange={(event) => setProductForm({ ...productForm, status: event.target.value })}
                  >
                    <option value="ACTIVE">사용 중</option>
                    <option value="REVIEW">검토</option>
                    <option value="INACTIVE">사용 중지</option>
                  </Select>
                </label>
                <div>
                  <Button disabled={productMutation.isPending}>
                    {productMutation.isPending ? "저장 중..." : "저장"}
                  </Button>{" "}
                  <Button type="button" $secondary onClick={() => setProductForm(null)}>
                    취소
                  </Button>
                </div>
              </FormGrid>
            </Card>
          )}

          <QueryStatus query={productsQuery} empty={products.length === 0} />
          <TableWrap>
            <Table>
              <thead>
                <tr>
                  <th>제품 코드</th>
                  <th>제품명</th>
                  <th>분류</th>
                  <th>단위</th>
                  <th>활성 BOM</th>
                  <th>상태</th>
                  {canManage && <th>관리</th>}
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.productId}>
                    <td>{product.productCode}</td>
                    <td>{product.productName}</td>
                    <td>{product.category}</td>
                    <td>{product.unit}</td>
                    <td>{product.activeBomCode ? `${product.activeBomCode} v${product.activeBomVersion}` : "-"}</td>
                    <td><Badge $tone={toneForStatus(product.status)}>{product.statusLabel}</Badge></td>
                    {canManage && (
                      <td>
                        <Button type="button" $secondary onClick={() => setProductForm({ ...product })}>
                          수정
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrap>
          <CommonPagination
            ariaLabel="제품 페이지 이동"
            currentPage={(productsQuery.data?.number ?? productPage) + 1}
            pageSize={productsQuery.data?.size ?? PAGE_SIZE}
            totalItems={productsQuery.data?.totalElements ?? 0}
            totalPages={productsQuery.data?.totalPages ?? 0}
            onPageChange={(page) => setProductPage(page - 1)}
          />
        </>
      )}

      {section === "material" && (
        <>
          <Toolbar>
            <Input
              value={materialKeywordDraft}
              onChange={(event) => {
                setMaterialKeywordDraft(event.target.value);
                setMaterialPage(0);
              }}
              placeholder="원자재 코드·원자재명 검색"
            />
            <Select
              value={materialStatus}
              onChange={(event) => {
                setMaterialStatus(event.target.value);
                setMaterialPage(0);
              }}
            >
              <option value="">전체 상태</option>
              <option value="ACTIVE">사용 중</option>
              <option value="INACTIVE">사용 중지</option>
            </Select>
            {canManage && (
              <Button type="button" onClick={() => setMaterialForm({ ...emptyMaterial })}>
                원자재 등록
              </Button>
            )}
          </Toolbar>

          {materialForm && (
            <Card>
              <h2>{materialForm.materialId ? "원자재 수정" : "원자재 등록"}</h2>
              <FormGrid onSubmit={saveMaterial}>
                <label>
                  원자재 코드
                  <input
                    maxLength="30"
                    value={materialForm.materialCode}
                    onChange={(event) => setMaterialForm({ ...materialForm, materialCode: event.target.value })}
                    required
                  />
                </label>
                <label>
                  원자재명
                  <input
                    maxLength="100"
                    value={materialForm.materialName}
                    onChange={(event) => setMaterialForm({ ...materialForm, materialName: event.target.value })}
                    required
                  />
                </label>
                <label>
                  단위
                  <input
                    maxLength="20"
                    value={materialForm.unit}
                    onChange={(event) => setMaterialForm({ ...materialForm, unit: event.target.value })}
                    placeholder="예: kg, EA"
                    required
                  />
                </label>
                <label>
                  안전재고
                  <input
                    type="number"
                    min="0"
                    step="0.001"
                    value={materialForm.safetyStockQty}
                    onChange={(event) => setMaterialForm({ ...materialForm, safetyStockQty: event.target.value })}
                    required
                  />
                </label>
                <label>
                  상태
                  <Select
                    value={materialForm.status}
                    onChange={(event) => setMaterialForm({ ...materialForm, status: event.target.value })}
                  >
                    <option value="ACTIVE">사용 중</option>
                    <option value="INACTIVE">사용 중지</option>
                  </Select>
                </label>
                <div>
                  <Button disabled={materialMutation.isPending}>
                    {materialMutation.isPending ? "저장 중..." : "저장"}
                  </Button>{" "}
                  <Button type="button" $secondary onClick={() => setMaterialForm(null)}>
                    취소
                  </Button>
                </div>
              </FormGrid>
            </Card>
          )}

          <QueryStatus query={materialsQuery} empty={materials.length === 0} />
          <TableWrap>
            <Table>
              <thead>
                <tr>
                  <th>원자재 코드</th>
                  <th>원자재명</th>
                  <th>단위</th>
                  <th>안전재고</th>
                  <th>상태</th>
                  {canManage && <th>관리</th>}
                </tr>
              </thead>
              <tbody>
                {materials.map((material) => (
                  <tr key={material.materialId}>
                    <td>{material.materialCode}</td>
                    <td>{material.materialName}</td>
                    <td>{material.unit}</td>
                    <td>{material.safetyStockQty}</td>
                    <td><Badge $tone={toneForStatus(material.status)}>{material.statusLabel}</Badge></td>
                    {canManage && (
                      <td>
                        <Button type="button" $secondary onClick={() => setMaterialForm({ ...material })}>
                          수정
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrap>
          <CommonPagination
            ariaLabel="원자재 페이지 이동"
            currentPage={(materialsQuery.data?.number ?? materialPage) + 1}
            pageSize={materialsQuery.data?.size ?? PAGE_SIZE}
            totalItems={materialsQuery.data?.totalElements ?? 0}
            totalPages={materialsQuery.data?.totalPages ?? 0}
            onPageChange={(page) => setMaterialPage(page - 1)}
          />
        </>
      )}
    </>
  );
}
