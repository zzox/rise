#!/usr/bin/perl

$f = $ARGV[0];

$pagestart = 0; 
$charstart = 0; 
$kernstart = 0;

$s = "<?xml version=\"1.0\"?>\n<font>\n"; 
open(F, $f);
while(<F>) {
 s/\ (.+?)=([^\".]+?)[\ \n]/\ $1\=\"$2\"\ /isgm;
 s/\ (.+?)=([^\".]+?)[\ \n]/\ $1\=\"$2\"\ /isgm;
 if (/^(info.*)$/) {
  $s .= "<$1 />\n";
 }
 if (/^(common.*)$/) {
  $s .= "<$1 />\n";
 }
 if (not $pagestart and /^(page.*)$/) {
  $pagestart = 1;
  $s .= "<pages>\n";
 }
 if ($pagestart and not /^(page.*)$/) {
  $pagestart = 0; 
  $s .="\n</pages>\n";
 }
 if ($pagestart and /^(page.*)$/) {
  $s .= "<$1 />\n";
 }

 if (/^(chars.*)$/) {
  $charstart = 1;
  $s .= "<$1>\n";
 }
 if ($charstart and not /^(char.*)$/) {
  $charstart = 0; 
  $s .="\n</chars>\n";
 }
 if ($charstart and /^(char\ .*)$/) {
  $s .= "<$1 />\n";
 }

 if (/^(kernings.*)$/) {
  $kernstart = 1;
  $s .= "<$1>\n";
 }
 if ($kernstart and not /^(kerning.*)$/) {
  $kernstart = 0; 
  #$s .="\n</kernings>\n";
 }
 if ($kernstart and /^(kerning\ .*)$/) {
  $s .= "<$1 />\n";
 }
 

}
close F; 
$s .= "\n</kernings>\n</font>";  
open(F, ">$f");
print F $s;
close F;
