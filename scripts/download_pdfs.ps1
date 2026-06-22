# Download official guideline PDFs into the local pdfs/ folder
# Run from the repository root in PowerShell

$files = @(
    @{ url = 'https://cdsco.gov.in/opencms/resources/UploadCDSCOWeb/2022/new_DC_rules/NEW%20DRUGS%20ANDctrS%20RULE%2C%202019.pdf'; out = 'pdfs/ndct_rules_2019.pdf' },
    @{ url = 'https://health.ec.europa.eu/system/files/2022-08/20220825_gmp-an1_en_0.pdf'; out = 'pdfs/eu_gmp_annex1_2022.pdf' },
    @{ url = 'https://www.who.int/docs/default-source/biologicals/gmp/annex-2-who-good-manufacturing-practices-for-biological-products.pdf'; out = 'pdfs/who_trs999_annex2.pdf' },
    @{ url = 'https://www.who.int/publications/m/item/trs1044-annex2'; out = 'pdfs/who_trs1044_annex2.pdf' },
    @{ url = 'https://ichc2017.mcsprogram.org/Resources/u4A75B/245550/OrangeGuideMhra.pdf'; out = 'pdfs/mhra_orange_guide.pdf' },
    @{ url = 'https://picscheme.org/docview/3463'; out = 'pdfs/pics_smf_docview_3463.html' },
    @{ url = 'https://picscheme.org/docview/3464'; out = 'pdfs/pics_annex1_concept_paper_3464.html' }
)

# Ensure pdfs directory exists
$dir = Join-Path (Get-Location) 'pdfs'
if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }

foreach ($f in $files) {
    $url = $f.url
    $out = $f.out
    Write-Host "Downloading $url -> $out"
    try {
        Invoke-WebRequest -Uri $url -OutFile $out -UseBasicParsing -ErrorAction Stop
        Write-Host "Saved: $out"
    } catch {
        Write-Warning "Failed to download $url : $($_.Exception.Message)"
    }
}

Write-Host 'Done. Verify files in the pdfs/ folder.'
