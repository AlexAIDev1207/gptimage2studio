#!/usr/bin/env perl
use strict;
use warnings;

# Replace /imgs/...png|jpg|jpeg with .webp in target files passed as args.
my $count = 0;
for my $file (@ARGV) {
    open(my $fh, '<', $file) or die "Cannot open $file: $!";
    local $/; my $content = <$fh>;
    close($fh);

    my $orig = $content;
    $content =~ s{(/imgs/[a-zA-Z0-9/_.-]+)\.(png|jpg|jpeg)\b}{$1.webp}g;
    next if $content eq $orig;

    open(my $out, '>', $file) or die "Cannot write $file: $!";
    print $out $content;
    close($out);
    $count++;
    print "✓ updated $file\n";
}
print "\nUpdated $count files\n";
