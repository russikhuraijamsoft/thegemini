import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:talkos/app/talkos_app.dart';

void main() {
  testWidgets('TalkOS launches into the mobile operations shell', (tester) async {
    await tester.pumpWidget(const TalkOsApp());
    expect(find.text('TalkOS'), findsOneWidget);
    expect(find.text('Operations modules'), findsOneWidget);
    expect(find.text('Point of Sale'), findsWidgets);
  });

  testWidgets('TalkOS shows its full brand on extended desktop navigation', (tester) async {
    tester.view.physicalSize = const Size(1440, 900);
    tester.view.devicePixelRatio = 1;
    await tester.pumpWidget(const TalkOsApp());

    expect(find.text('TalkOS'), findsOneWidget);
    expect(find.text('Overview'), findsNWidgets(2));
    expect(find.text('Operations modules'), findsOneWidget);

    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
  });
}
