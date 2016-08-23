#
# Script.ps1
#
#$rootDir = Read-Host "Please enter the folder"
$rootDir = "D:\Documents\"
$TheContainer = "English For Children A"
$ContainerDir =$rootDir+$TheContainer

#Get the Html
$rootHtml = " "
dir -File $ContainerDir | ForEach-Object {
	if($_.Name.Contains('.htm')){
		$rootHtml = $_.Name
	}
}

$contentForContainer ="{""Categories"":["
dir -Directory $ContainerDir | ForEach-Object {
	$contentForContainer = $contentForContainer +"{""Folder"":"""+ $_.Name +"""},"

	#Get into each Category
	$forCategoryJson="{""Cards"":["
	$files = dir -File -LiteralPath $_.FullName
	$nCounts = 0
	ForEach ($file in $files){
		#If((-Not $file.Name.Contains('.level')) -and (-not $file.Name.Contains('.json'))){
		If(!$file.Name.Contains('.level') -And !$file.Name.Contains('.json')){
			$forCategoryJson += "{""FileName"":"""+ $file.Name +"""},"
			$nCounts++
		}
	}
	If($nCounts -gt 0){
	$forCategoryJson = $forCategoryJson.Substring(0,$forCategoryJson.Length-1)
	}
	$forCategoryJson+="]"
	#Add in Link from Container
	If($ContainerDir.Length -gt 3){
	$forCategoryJson+=",""Link"":""/"+$rootHtml+""""
	}
	$forCategoryJson+="}"

	$pathToMYCategoryJson =$_.FullName+"\MYCategory.json"
	Out-File -Encoding utf8 -LiteralPath $pathToMYCategoryJson -InputObject $forCategoryJson
} 

$contentForContainer = $contentForContainer.Substring(0, $contentForContainer.Length-1)
$contentForContainer+="]}"
Out-File -Encoding utf8 -FilePath ($ContainerDir+"\MYContainer.json") -InputObject $contentForContainer