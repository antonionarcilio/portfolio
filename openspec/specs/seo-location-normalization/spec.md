# seo-location-normalization Specification

## Purpose

Normaliza a string de localização vinda do CMS para códigos ISO 3166 no JSON-LD `PostalAddress` da página gamified, garantindo que país e estado sejam reconhecidos corretamente pelos buscadores.

## Requirements

### Requirement: País normalizado para ISO 3166-1 alpha-2

O sistema DEVE (MUST) emitir `addressCountry` no JSON-LD como código ISO 3166-1 alpha-2 (ex.: `BR`), independentemente de a string do CMS usar nome por extenso ou código.

#### Scenario: País por extenso

- **WHEN** a localização do CMS é `São Luís, Ma - Brasil`
- **THEN** o `PostalAddress.addressCountry` no JSON-LD é `BR`

#### Scenario: País já em código

- **WHEN** a localização do CMS é `São Luís, MA - BR`
- **THEN** o `PostalAddress.addressCountry` no JSON-LD é `BR`

#### Scenario: País desconhecido

- **WHEN** a localização contém um país sem mapeamento conhecido
- **THEN** o `addressCountry` é omitido do JSON-LD para não emitir valor inválido

### Requirement: Estado normalizado para ISO 3166-2

O sistema DEVE (MUST) emitir `addressRegion` no JSON-LD como código ISO 3166-2 na forma MAIÚSCULA (ex.: `MA`), independentemente do casing da string do CMS.

#### Scenario: Estado em minúsculas

- **WHEN** a localização do CMS é `São Luís, Ma - Brasil`
- **THEN** o `PostalAddress.addressRegion` no JSON-LD é `MA`

#### Scenario: Estado já em maiúsculas

- **WHEN** a localização do CMS é `São Luís, MA - Brasil`
- **THEN** o `PostalAddress.addressRegion` no JSON-LD é `MA`

### Requirement: Localidade preservada

O sistema DEVE (MUST) manter `addressLocality` como a cidade/cidade da string do CMS, sem alteração de casing ou conteúdo.

#### Scenario: Localidade da string do CMS

- **WHEN** a localização do CMS é `São Luís, Ma - Brasil`
- **THEN** o `PostalAddress.addressLocality` no JSON-LD é `São Luís`

### Requirement: Formato não reconhecido

Quando a string de localização não corresponder ao formato esperado (`cidade, UF - país`), o sistema NÃO DEVE (MUST NOT) emitir um `address` incompleto no JSON-LD.

#### Scenario: String sem país/estado

- **WHEN** a localização do CMS é apenas `São Luís`
- **THEN** o `PostalAddress` é omitido do JSON-LD em vez de emitir campos vazios

#### Scenario: String vazia

- **WHEN** a localização do CMS é vazia
- **THEN** o `PostalAddress` é omitido do JSON-LD
